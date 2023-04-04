import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'
import { type IIssue } from './issueModel.js'

export interface IMessage extends Document {
  created_by: IUser['_id']
  issue: IIssue['_id']
  created_at: Date
  last_edit: Date
  content: string
}

const messageSchema = new Schema({
  _id: Schema.Types.ObjectId,
  created_by: { type: Schema.Types.ObjectId, refPath: 'User' },
  issue: { type: Schema.Types.ObjectId, refPath: 'Issue' },
  created_at: Date,
  last_edit: Date,
  content: String
})

export default model<IMessage>('Message', messageSchema, 'messages')
