import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import User from '../models/userModel.js'
import RefreshToken from '../models/refreshTokenModel.js'

dotenv.config({ path: '.env.development' })

export const token = jsonwebtoken.sign(
  { email: 'testuser@email.com' },
  // eslint-disable-next-line
  process.env.JWT_SECRET_KEY!
)

export const user = new User({
  email: 'testuser@email.com',
  password: 'password',
  username: 'testuser'
})

export const refreshToken = new RefreshToken({
  email: 'testuser@email.com',
  token
})
