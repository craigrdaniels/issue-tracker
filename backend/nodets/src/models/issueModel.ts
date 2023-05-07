import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'
import { type IProject } from './projectModel.js'

export interface IIssue extends Document {
  title: string
  created_at: Date
  is_open: boolean
  tags: [string]
  created_by: IUser
  project: IProject['_id']
  assigned_users: [IUser['_id']]
}

const issueSchema = new Schema(
  {
    title: String,
    created_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    project: { type: Schema.Types.ObjectId, refPath: 'Project' },
    assigned_users: { type: [Schema.Types.ObjectId], refPath: 'User' },
    is_open: { type: Boolean, default: true },
    tags: { type: [String] }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)

export default model<IIssue>('Issue', issueSchema, 'issues')
