import { type Types, type Document, Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { type IRole } from './roleModel.js'

export interface IUser extends Document {
  _id: Types.ObjectId
  username: string
  password: string
  email: string
  role: IRole['_id']
  created: Date
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: { type: Schema.Types.ObjectId, refPath: 'Role' },
    created: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret.__v
      }
    }
  }
)

userSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

export default model<IUser>('User', userSchema, 'users')
