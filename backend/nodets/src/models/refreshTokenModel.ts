import { Schema, model, type Document } from 'mongoose'
import { type IUser } from './userModel.js'

export interface IRefreshToken extends Document {
  user: IUser['_id']
  token: string
  email: string
  expires: Date
  created: Date
}

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  token: String,
  email: { type: String, unique: true },
  expires: Date,
  created: { type: Date, default: Date.now }
})

export default model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema,
  'refreshTokens'
)
