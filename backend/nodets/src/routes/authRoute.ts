import type { Request, Response, NextFunction } from 'express'
import express from 'express'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
import AuthController from '../controllers/AuthController.js'

const authRouter = express.Router()

authRouter.post('/login', catchAsyncFunction(AuthController.login))

authRouter.post(
  '/logout',
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      return AuthController.logout(req, res, next)
    }
  )
)

export default authRouter
