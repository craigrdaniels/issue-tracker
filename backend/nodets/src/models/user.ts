import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: Array,
    required: true
  },
  profile_pic: {
    type: String,
    required: false
  },
  projects: {
    type: Array,
    required: false
  }
})

export default model('User', userSchema, 'users')
