import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  username: String,
  password: String,
  email: String,
  role: { type: Schema.Types.ObjectId, refPath: 'Role' },
  profile_pic: String,
  projects: { type: [Schema.Types.ObjectId], refPath: 'Project' }
})

export default model('User', userSchema, 'users')
