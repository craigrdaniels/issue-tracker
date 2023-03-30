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
      next({ status: 400, message: 'Email is required' })
      return
    }

    // check the user has entered a valid email address
    if (
      req.body?.email.match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.-]{2,}$/i
      ) === null
    ) {
      next({ status: 400, message: 'Not a valid email addrress' })
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
      username: req.body.username ?? req.body.email.split('@')[0]
    })
    await user.save().then((data) => {
      const token = jsonwebtoken.sign(
        // eslint-disable-next-line no-underscore-dangle
        { id: data._id, email: data.email },
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: '1h'
        }
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            process.env.JWT_SECRET_KEY!,
            {
              expiresIn: '1h'
            }
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
