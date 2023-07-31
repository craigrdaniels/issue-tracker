import type { Request, Response, NextFunction, RequestHandler } from 'express'
import Issue from '../models/issueModel.js'
import User from '../models/userModel.js'
import RefreshToken from '../models/refreshTokenModel.js'

export const findIssueById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.params === undefined || req.params.issueID === undefined) {
      res.status(400).json({ success: false, message: 'No issue ID given' })
      return
    }
    await Issue.findOne({ _id: req.params.issueID })
      .then((issue) => {
        if (issue === null || issue === undefined) {
          res.status(400).json({ success: false, message: 'Issue not found' })
          return
        }
        next()
      })
      .catch((error) => {
        res.status(400).json({ success: false, error })
      })
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
}

export const getUserIdByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await User.findOne({ email: req.email })
      .then(async (user) => {
        if (user === null || user === undefined) {
          res.status(400).json({ success: false, message: 'User not found' })
          return
        }
        req._id = user._id.toString()
        next()
      })
      .catch((error) => {
        res.status(400).json({ success: false, error })
      })
  } catch (error) {
    res.status(400).json({ success: false, error })
  }
}

export const isValidRefreshToken = async (
  email: string,
  token: string
): Promise<boolean> => {
  try {
    const refreshToken = await RefreshToken.findOne({ email, token })
    if (refreshToken === null || refreshToken === undefined) return false
    return true
  } catch (e) {
    return false
  }
}
