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
import type * as mongoose from 'mongoose'
import User from '../models/userModel.js'
import RefreshToken, {
  type IRefreshToken
} from '../models/refreshTokenModel.js'
import isAuthenticated from '../helpers/authHelper.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'

dotenv.config()

const generateToken = (email: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  jsonwebtoken.sign({ email }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '5m'
  })

const generateRefreshToken = (email: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  jsonwebtoken.sign({ email }, process.env.JWT_REFRESH_KEY!, {
    expiresIn: '1d'
  })

const isValidRefreshToken = (
  doc: IRefreshToken | null,
  token: string,
  res: Response
): boolean => {
  if (doc === null) {
    res.status(401).json({ success: false, message: 'Token not found in DB' })
    return false
  }
  if (doc.token !== undefined && doc.token !== token) {
    res.status(401).json({ success: false, message: 'Tokens do not match' })
    return false
  }
  return true
}
const usersRouter = express.Router()

usersRouter.post(
  '/users/signup',
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
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

      const exists: { _id: mongoose.Types.ObjectId | undefined } | null =
        await User.exists({
          email: req.body.email
        })

      if (exists !== null) {
        next({ status: 400, messages: 'User already exists' })
        return
      }

      // save the user and issue a jwt token
      await user.save().then(async (data) => {
        const token: string = generateToken(data.email)

        const newRefreshToken = new RefreshToken({
          email: data.email,
          token: generateRefreshToken(data.email)
        })

        await newRefreshToken.save()

        res
          .status(200)
          .cookie('JWT', token, { maxAge: 900000, httpOnly: true })
          .cookie('refreshToken', newRefreshToken.token, {
            maxAge: 900000,
            httpOnly: true
          })
          .json({
            success: true,
            message: 'User created',
            user: data.username
          })
      })
    }
  ) as RequestHandler
)

usersRouter.post(
  '/users/login',
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.body.email === undefined || req.body.password === undefined) {
        next({ status: 400, message: 'Params missing' })
        return
      }

      await User.findOne({ email: req.body.email.toLowerCase() })
        .then(async (user) => {
          if (user === null || user === undefined) {
            next({ status: 401, message: 'User not found' })
            return
          }
          if (!bcrypt.compareSync(req.body.password, user.password)) {
            next({ status: 401, message: 'Wrong password' })
            return
          }

          const token: string = generateToken(user.email)

          const newRefreshToken = new RefreshToken({
            email: user.email,
            token: generateRefreshToken(user.email)
          })

          await RefreshToken.findOneAndUpdate(
            { email: user.email },
            {
              $set: {
                email: newRefreshToken.email,
                token: newRefreshToken.token,
                created: Date.now()
              }
            },
            { upsert: true }
          ).catch((error) => {
            next({
              status: 400,
              message: `Error updating refresh token ${error}`
            })
          })

          res
            .status(200)
            .cookie('JWT', token, { maxAge: 900000, httpOnly: true })
            .cookie('refreshToken', newRefreshToken.token, {
              maxAge: 900000,
              httpOnly: true
            })
            .json({
              success: true,
              user: user.username
            })
        })
        .catch((error) => {
          next({ status: 400, message: `Error finding user ${error}` })
        })
    }
  ) as RequestHandler
)

usersRouter.put(
  '/users/update',
  isAuthenticated,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      await User.replaceOne({ email: req.email }, req.body).then(() => {
        res.status(200).json({ success: true, message: 'User details updated' })
      })
    }
  ) as RequestHandler
)

usersRouter.post(
  '/users/refresh-token',
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      await RefreshToken.findOne({ email: req.body.email }).then(
        async (data) => {
          if (data === null || data === undefined) {
            next({ status: 401, message: 'Token not found in DB' })
            return
          }
          if (isValidRefreshToken(data, req.body.token, res)) {
            const newToken: string = generateToken(data.email)

            const newRefreshToken = new RefreshToken({
              email: data.email,
              token: generateRefreshToken(data.email)
            })
            // eslint-disable-next-line no-param-reassign
            data.token = newRefreshToken.token
            await data.save()
            res
              .status(200)
              .cookie('JWT', newToken, { maxAge: 900000, httpOnly: true })
              .cookie('refreshTokn', newRefreshToken.token, {
                maxAge: 900000,
                httpOnly: true
              })
              .json({
                success: true,
                message: 'Token Updated'
              })
          } else {
            next({ status: 401, message: 'Invalid token' })
          }
        }
      )
    }
  ) as RequestHandler
)

usersRouter.delete(
  '/users/refresh-token',
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      await RefreshToken.findOne({ email: req.body.email }).then(
        async (data) => {
          if (data === null || data === undefined) {
            next({ status: 401, message: 'Token not found in DB' })
            return
          }
          if (isValidRefreshToken(data, req.body.token, res)) {
            await data.deleteOne()

            res.status(200).json({
              success: true,
              message: 'Token Deleted'
            })
          } else {
            next({ status: 401, message: 'Invalid token' })
          }
        }
      )
    }
  ) as RequestHandler
)

export default usersRouter
