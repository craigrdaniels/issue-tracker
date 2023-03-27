import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
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
  profile_pic: String,
  projects: { type: [Schema.Types.ObjectId], refPath: 'Project' },
  created: {
    type: Date,
    default: Date.now
  }
})

userSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

export default model('User', userSchema, 'users')
