import { Schema, model } from 'mongoose'

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: String,
  email: { type: String, unique: true },
  expires: Date,
  created: { type: Date, default: Date.now }
})

export default model('RefreshToken', refreshTokenSchema, 'refreshTokens')
