/* eslint-disable no-underscore-dangle */
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
import { type Types } from 'mongoose'
import User from '../models/user.js'
import RefreshToken from '../models/refreshToken.js'
import { json } from 'stream/consumers'

dotenv.config()

interface RTDecode {
  user: string
  email: string
}

const generateToken = (uid: Types.ObjectId, email: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  jsonwebtoken.sign({ id: uid, email }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '5m'
  })

const generateRefreshToken = (uid: Types.ObjectId, email: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  jsonwebtoken.sign({ id: uid, email }, process.env.JWT_REFRESH_KEY!, {
    expiresIn: '1d'
  })

const usersRouter = express.Router()

usersRouter.post('/users/signup', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check an email address is entered
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

    // check a password is entered
    if (
      req.body?.password === undefined ||
      req.body?.password.trim().length < 1
    ) {
      next({ status: 400, message: 'Password is required' })
      return
    }

    // create the user
    await User.init()
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      username: req.body.username ?? req.body.email.split('@')[0]
    })

    // save the user and issue a jwt token
    await user.save().then(async (data) => {
      const token: string = generateToken(data._id, data.email)

      const newRefreshToken = new RefreshToken({
        user: data._id,
        email: data.email,
        token: generateRefreshToken(data._id, data.email)
      })

      await newRefreshToken.save()

      res.status(200).json({
        success: true,
        message: 'User created',
        token,
        refreshToken: newRefreshToken.token
      })
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
    // check an email and password is entered
    if (req.body.email === undefined || req.body.password === undefined) {
      next({ status: 400, message: 'Params missing' })
      return
    }

    // make sure the user exists, password is correct and issue a token
    User.findOne({ email: req.body.email.toLowerCase() })
      .then(async (user) => {
        if (user == null) {
          next({ status: 400, message: 'User does not exist' })
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
          next({ status: 400, message: 'Wrong password' })
        } else {
          const token: string = generateToken(user._id, user.email)

          const newRefreshToken = new RefreshToken({
            user: user._id,
            email: user.email,
            token: generateRefreshToken(user._id, user.email)
          })

          await RefreshToken.findOneAndUpdate(
            { email: user.email },
            {
              $set: {
                user: newRefreshToken.user,
                email: newRefreshToken.email,
                token: newRefreshToken.token,
                created: Date.now()
              }
            },
            { upsert: true }
          ).catch((error) => {
            console.log(error)
          })

          res
            .status(200)
            .json({ success: true, token, refreshToken: newRefreshToken.token })
        }
      })
      .catch((err) => {
        console.log(err)
        next({ status: 400, error: err })
      })
  } catch (error) {
    console.log(error)
    next(error)
  }
}) as RequestHandler)

usersRouter.post('/users/refresh-token', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.token === undefined || req.body.email === undefined) {
      next({ status: 400, message: 'Params missing' })
      return
    }

    const decoded = jsonwebtoken.verify(
      req.body.token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_REFRESH_KEY!
    ) as RTDecode

    if (req.body.email !== decoded.email) {
      next({ status: 400, message: 'Incorrect token for that ID' })
      return
    }

    await RefreshToken.findOne({ email: req.body.email }).then(async (data) => {
      if (data === null) {
        next({ status: 400, message: 'Token not found' })
        return
      }
      if (data.token !== req.body.token) {
        next({ status: 400, message: 'Tokens do not match' })
        return
      }
      if (data.user === undefined) {
        next({ status: 400, message: 'User ID not in document' })
        return
      }
      if (data.email === undefined) {
        next({ status: 400, messaage: 'Email not in document' })
        return
      }

      const newToken: string = generateToken(data.user, data.email)

      const newRefreshToken = new RefreshToken({
        user: data.user,
        email: data.email,
        token: generateRefreshToken(data.user, data.email)
      })

      // eslint-disable-next-line no-param-reassign
      data.token = newRefreshToken.token
      await data.save()

      res.status(200).json({
        success: true,
        message: 'Token Updated',
        token: newToken,
        refreshToken: newRefreshToken.token
      })
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}) as RequestHandler)

usersRouter.delete('/users/refresh-token', (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.token === undefined || req.body.email === undefined) {
      next({ status: 400, message: 'Params missing' })
      return
    }

    const decoded = jsonwebtoken.verify(
      req.body.token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_REFRESH_KEY!
    ) as RTDecode

    if (req.body.email !== decoded.email) {
      next({ status: 400, message: 'Incorrect token for that ID' })
      return
    }

    await RefreshToken.findOne({ email: req.body.email }).then(async (data) => {
      if (data === null) {
        next({ status: 400, message: 'Token not found' })
        return
      }
      if (data.token !== req.body.token) {
        next({ status: 400, message: 'Tokens do not match' })
        return
      }
      if (data.user === undefined) {
        next({ status: 400, message: 'User ID not in document' })
        return
      }
      if (data.email === undefined) {
        next({ status: 400, messaage: 'Email not in document' })
        return
      }

      await data.deleteOne()

      res.status(200).json({
        success: true,
        message: 'Token Deleted'
      })
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}) as RequestHandler)

export default usersRouter

// TODO: add logout function
