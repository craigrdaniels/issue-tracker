import { Schema, model } from 'mongoose'

const messageSchema = new Schema({
  _id: Schema.Types.ObjectId,
  created_by: { type: Schema.Types.ObjectId, refPath: 'User' },
  issue: { type: Schema.Types.ObjectId, refPath: 'Issue' },
  created_at: Date,
  last_edit: Date,
  content: String,
  attachments: [String]
})

export default model('Message', messageSchema, 'messages')
