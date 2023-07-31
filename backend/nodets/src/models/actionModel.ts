import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'
import { type IIssue } from './issueModel.js'

export interface IAction extends Document {
  issue: IIssue['_id']
  user: IUser['_id']
  action: string
  created_at: Date
}

const actionSchema = new Schema<IAction>({
  issue: { type: Schema.Types.ObjectId, refPath: 'Issue' },
  user: { type: Schema.Types.ObjectId, refPath: 'User' },
  action: String,
  created_at: { type: Date, default: Date.now }
})

export default model<IAction>('Action', actionSchema, 'actions')
