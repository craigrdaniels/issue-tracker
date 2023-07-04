import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'
import { type IProject } from './projectModel.js'
import { type ITag } from './tagModel.js'

export interface IIssue extends Document {
  title: string
  created_at: Date
  is_open: boolean
  tags: [ITag]
  created_by: IUser
  project: IProject
  assigned_users: [IUser]
  messages_count?: number
}

const issueSchema = new Schema(
  {
    title: String,
    created_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    assigned_users: { type: [Schema.Types.ObjectId], ref: 'User' },
    is_open: { type: Boolean, default: true },
    tags: { type: [Schema.Types.ObjectId], ref: 'Tag' }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
      }
    }
  }
)

issueSchema.virtual('messages_count', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'issue',
  count: true
})

export default model<IIssue>('Issue', issueSchema, 'issues')
