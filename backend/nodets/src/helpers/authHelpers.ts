import type { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { isValidRefreshToken } from './dbHelpers.js'

dotenv.config()

interface IDecode {
  email: string
}

export const generateToken = (email: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  jsonwebtoken.sign({ email }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '5m'
  })

export const generateRefreshToken = (email: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  jsonwebtoken.sign({ email }, process.env.JWT_REFRESH_KEY!, {
    expiresIn: '1d'
  })

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token: string = req.cookies.JWT

    const decoded = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET_KEY!
    ) as IDecode

    req.email = decoded.email
    next()
  } catch (err) {
    // missing JWT - create a new one using refresh token
    try {
      const refreshToken: string = req.cookies.refreshToken

      const decoded = jsonwebtoken.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY!
      ) as IDecode

      // check token against what is in the database
      if (!(await isValidRefreshToken(decoded.email, refreshToken))) {
        throw new Error('Refresh token not found or does not match DB')
      }

      // if refresh token is valid we create a new jwt
      const token = generateToken(decoded.email)

      res
        .cookie('JWT', token, { maxAge: 900000, httpOnly: true })
        .cookie('refreshToken', refreshToken, {
          maxAge: 3600000,
          httpOnly: true
        })

      req.email = decoded.email
      next()
    } catch (err2) {
      res
        .status(401)
        .clearCookie('JWT')
        .clearCookie('refreshToken')
        .json({ success: false, message: 'Missing or invalid refresh token' })
    }
  }
}
