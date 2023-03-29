import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler
} from 'express'
import express from 'express'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
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

    await User.init()

    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      username: req.body.username.trim() ?? req.body.email.split('@')[0]
    })
    await user.save().then((data) => {
      const token = jsonwebtoken.sign(
        // eslint-disable-next-line no-underscore-dangle
        { id: data._id, email: data.email },
        process.env.JWT_SECRET_KEY ?? '' // TODO: #5 assert var is defined - may be sec flaw if undefined and '' is used as key
      )
      res.status(200).json({ success: true, message: 'User created', token })
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}) as RequestHandler)

usersRouter.post('/users/login', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.email === undefined || req.body.password === undefined) {
      next({ status: 400, message: 'Params missing' })
      return
    }

    User.findOne({ email: req.body.email.lowercase() })
      .then((user) => {
        if (user == null) {
          next({ status: 400, message: 'User does not exist' })
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
          next({ status: 400, message: 'Wrong password' })
        } else {
          const token = jsonwebtoken.sign(
            // eslint-disable-next-line no-underscore-dangle
            { id: user._id, email: user.email },
            process.env.JWT_SECRET_KEY ?? ''
          )
          res.status(200).json({ success: true, token })
        }
      })
      .catch((err) => {
        next({ status: 400, error: err })
      })
  } catch (error) {
    console.log(error)
    next(error)
  }
}) as RequestHandler)

export default usersRouter
