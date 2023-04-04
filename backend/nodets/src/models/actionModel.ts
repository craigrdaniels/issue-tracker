import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'
import { type IIssue } from './issueModel.js'

export interface IAction extends Document {
  issue: IIssue['_id']
  user: IUser['_id']
  action: string
}

const actionSchema = new Schema({
  issue: { type: Schema.Types.ObjectId, refPath: 'Issue' },
  user: { type: Schema.Types.ObjectId, refPath: 'User' },
  action: String
})

export default model<IAction>('Action', actionSchema, 'actions')
