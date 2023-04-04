import { Schema, model, type Document } from 'mongoose'
import bcrypt from 'bcrypt'
import { type IRole } from './roleModel.js'
import { type IProject } from './projectModel.js'

export interface IUser extends Document {
  username: string
  password: string
  email: string
  role: IRole['_id']
  projects: [IProject['_id']]
  created: Date
}

const userSchema = new Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: { type: Schema.Types.ObjectId, refPath: 'Role' },
  projects: { type: [Schema.Types.ObjectId], refPath: 'Project' },
  created: {
    type: Date,
    default: Date.now
  }
})

userSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

export default model<IUser>('User', userSchema, 'users')
