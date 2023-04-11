import { type Request, type Response, type NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import RefreshToken from '../models/refreshTokenModel.js'

dotenv.config()

interface IDecode {
  email: string
}

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First check the auth headers were defined
    if (
      req.headers === undefined ||
      req.headers.authorization === undefined ||
      req.headers.authorization.split(' ')[0] !== 'JWT'
    ) {
      res.status(401).json({ success: false, message: 'Token not found' })
      return
    }

    const token: string = req.headers.authorization.split(' ')[1]

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const decoded = jsonwebtoken.verify(
      token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_SECRET_KEY!
    ) as IDecode

    // Check the user has a token in the DB and it matches the one sent
    const data = await RefreshToken.findOne({
      email: decoded.email
    })

    if (data?.token !== token) {
      res.status(401).json({ success: false, message: 'Invalid token' })
      return
    }

    req.email = decoded.email
    next()
  } catch (error) {
    res.status(403).json({ success: false, error })
  }
}

export default isAuthenticated
