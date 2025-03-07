import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import RefreshToken from '../models/refreshTokenModel.js'
import Issue from '../models/issueModel.js'
import Message from '../models/messageModel.js'
import Action from '../models/actionModel.js'
import Project from '../models/projectModel.js'
import Tag from '../models/tagModel.js'

dotenv.config({ path: '.env.development' })

export const token = jsonwebtoken.sign(
  { email: 'testuser@email.com' },
  // eslint-disable-next-line
  process.env.JWT_SECRET_KEY!
)
export const rToken = jsonwebtoken.sign(
  { email: 'testuser@email.com' },
  // eslint-disable-next-line
  process.env.JWT_REFRESH_KEY!
)

export const user = new User({
  email: 'testuser@email.com',
  password: bcrypt.hashSync('password', 10),
  username: 'testuser'
})

export const refreshToken = new RefreshToken({
  email: 'testuser@email.com',
  token: rToken
})

export const project = new Project({
  name: 'test project'
})

export const issue = new Issue({
  title: 'Test Issue',
  created_by: user._id,
  project: project._id
})

export const message = new Message({
  content: 'Test message content',
  created_by: user._id,
  issue: issue._id
})

export const action = new Action({
  action: 'Test Action',
  user: user._id,
  issue: issue._id
})

export const tag = new Tag({
  tag: 'Test Tag',
  color: '#000000'
})
