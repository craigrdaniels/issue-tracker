import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import RefreshToken from '../models/refreshTokenModel.js'
import Issue from '../models/issueModel.js'
import Message from '../models/messageModel.js'
import Action from '../models/actionModel.js'

dotenv.config({ path: '.env.development' })

export const token = jsonwebtoken.sign(
  { email: 'devuser@email.com' },
  // eslint-disable-next-line
  process.env.JWT_SECRET_KEY!
)
export const rToken = jsonwebtoken.sign(
  { email: 'devuser@email.com' },
  // eslint-disable-next-line
  process.env.JWT_REFRESH_KEY!
)

export const user = new User({
  email: 'devuser@email.com',
  password: bcrypt.hashSync('password', 10),
  username: 'devuser'
})

export const refreshToken = new RefreshToken({
  email: 'devuser@email.com',
  token: rToken
})

export const issue = new Issue({
  title: 'Dev Issue',
  created_by: user._id
})

export const message = new Message({
  content: 'Dev message content',
  created_by: user._id,
  issue: issue._id
})

export const action = new Action({
  action: 'Dev Action',
  user: user._id,
  issue: issue._id
})
