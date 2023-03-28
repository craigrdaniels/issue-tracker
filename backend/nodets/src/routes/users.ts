import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler
} from 'express'
import express from 'express'
import bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import User from '../models/user.js'

dotenv.config()

const usersRouter = express.Router()

usersRouter.post('/users/signup', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body.email) // BUG: #2 Returns undefined
    if (req.body?.email === undefined || req.body?.email.trim().length < 1) {
      // TODO: #1 need to validate it is a real email address?
      next({ status: 400, message: 'Email is required' })
      return
    }
    if (
      req.body?.password === undefined ||
      req.body?.password.trim().length < 1
    ) {
      next({ status: 400, message: 'Password is required' })
      return
    }

    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      username: req.body.username.trim() ?? req.body.email.split('@')[0]
    })
    await user.save()
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY ?? ''
    )
    res.status(200).json({ success: true, message: 'User created', token })
  } catch (error) {
    console.log(error)
    next(error)
  }
}) as RequestHandler)

export default usersRouter
