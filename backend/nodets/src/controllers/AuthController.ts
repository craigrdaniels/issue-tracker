import type { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User, { type IUser } from '../models/userModel.js'
import { generateRefreshToken, generateToken } from '../helpers/authHelpers.js'
import RefreshToken, {
  type IRefreshToken
} from '../models/refreshTokenModel.js'

class AuthController {
  static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { email, password } = req.body

    if (email === undefined || password === undefined) {
      throw new Error('Email and password are required')
    }

    const user: IUser = await User.findOne({ email }).select('+password')

    if (
      user === undefined ||
      user === null ||
      !bcrypt.compareSync(password, user.password)
    ) {
      throw new Error('Email and password do not match')
    }

    const token: string = generateToken(user.email)

    const newRefreshToken: IRefreshToken = new RefreshToken({
      email: user.email,
      token: generateRefreshToken(user.email)
    })

    // update refresh token in db
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
    ).catch(() => {
      throw new Error('Error updating refreshToken in DB')
    })

    res
      .cookie('JWT', token, { maxAge: 900000, httpOnly: true })
      .cookie('refreshToken', newRefreshToken.token, {
        maxAge: 3600000,
        httpOnly: true
      })
      .status(200)
      .json({
        success: true,
        user
      })
  }

  static logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await RefreshToken.findOneAndDelete({ email: req.body.email })

    res.clearCookie('JWT').clearCookie('refreshToken').status(200).json({
      success: true,
      message: 'User logged out'
    })
  }
}

export default AuthController
