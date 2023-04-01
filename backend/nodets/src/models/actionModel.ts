import { Schema, model } from 'mongoose'

const actionSchema = new Schema({
  _id: Schema.Types.ObjectId,
  issue: { type: Schema.Types.ObjectId, refPath: 'Issue' },
  user: { type: Schema.Types.ObjectId, refPath: 'User' },
  action: String
})

export default model('Action', actionSchema, 'actions')
