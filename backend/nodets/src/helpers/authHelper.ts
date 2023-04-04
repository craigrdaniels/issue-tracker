import { type Request, type Response, type NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

interface IDecode {
  email: string
}

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token = req.headers.authorization as string

    if (token === undefined) {
      res.status(401).json({ success: false, message: 'Token not found' })
      return
    }

    // eslint-disable-next-line prefer-destructuring
    token = token.split(' ')[1]

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const decoded = jsonwebtoken.verify(
      token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env.JWT_SECRET_KEY!
    ) as IDecode

    req.email = decoded.email
    next()
  } catch (error) {
    res.status(403).json({ success: false, error })
  }
}

export default isAuthenticated
