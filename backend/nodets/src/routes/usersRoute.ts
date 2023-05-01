/* eslint-disable no-underscore-dangle */
import { type Request, type Response, type NextFunction } from 'express'
import express from 'express'
import * as dotenv from 'dotenv'
import type * as mongoose from 'mongoose'
import UserController from '../controllers/UserController.js'
import User from '../models/userModel.js'
import { checkJwt } from '../helpers/authHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
import AuthController from '../controllers/AuthController.js'

dotenv.config()

const usersRouter = express.Router()

usersRouter.post(
  '/users/signup',
  // eslint-disable-next-line
  catchAsyncFunction(
    // eslint-disable-next-line
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

      const exists: { _id: mongoose.Types.ObjectId | undefined } | null =
        await User.exists({
          email: req.body.email
        })

      if (exists !== null) {
        next({ status: 400, messages: 'User already exists' })
        return
      }

      await UserController.newUser(req, res, next)

      await AuthController.login(req, res, next)
      next()
    }
  )
)

usersRouter.put(
  '/users/update',
  [checkJwt],
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      return UserController.editUser(req, res, next)
    }
  )
)

export default usersRouter
