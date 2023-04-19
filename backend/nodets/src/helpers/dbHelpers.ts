import type { Request, Response, NextFunction, RequestHandler } from 'express'
import Issue from '../models/issueModel.js'
import User from '../models/userModel.js'

export const findIssueById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Issue.findOne({ _id: req.params.issueID })
      .then((issue) => {
        if (issue === null || issue === undefined) {
          next({ status: 400, message: 'User not found' })
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
          console.log('User not found')
          return
        }
        req._id = user._id
        next()
      })
      .catch((error) => {
        console.log(error)
        res.status(400).json({ success: false, error })
      })
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, error })
  }
}
