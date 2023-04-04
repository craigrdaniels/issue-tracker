import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'
import { type IProject } from './projectModel.js'

export interface IIssue extends Document {
  title: string
  created_at: Date
  created_by: IUser['_id']
  project: IProject['_id']
  assigned_users: [IUser['_id']]
  is_open: boolean
  tags: [string]
}

const issueSchema = new Schema({
  title: String,
  created_at: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, refPath: 'User' },
  project: { type: Number, refPath: 'Project' },
  assigned_users: { type: [Schema.Types.ObjectId], refPath: 'User' },
  is_open: { type: Boolean, default: true },
  tags: { type: [String] }
})

export default model<IIssue>('Issue', issueSchema, 'issues')
