import {
  type RequestHandler,
  type NextFunction,
  type Request,
  type Response
} from 'express'
import express from 'express'
import isAuthenticated from '../helpers/authHelper.js'
import Issue from '../models/issueModel.js'
import User from '../models/userModel.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'

const issuesRouter = express.Router()

// Get all issues
issuesRouter.get(
  '/issues',
  isAuthenticated,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const issues = await Issue.find().sort({ added: -1 }).limit(150)
      res.json(issues)
    }
  ) as RequestHandler
)

// create a new issue
issuesRouter.post(
  '/issues',
  isAuthenticated,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.body.title === undefined) {
        next({ status: 400, message: 'Title is undefined' })
        return
      }

      await User.findOne({ email: req.email }).then(async (user) => {
        if (user === null || user === undefined) {
          next({ status: 401, message: 'User not found in DB' })
          return
        }

        const issue = new Issue({
          // BUG: #4 Issue validation failed
          title: req.body.title,
          created_by: user._id
        })
        await issue.save()
        res.status(200).json({ success: true, message: 'Issue created' })
      })
    }
  ) as RequestHandler
)

issuesRouter.get(
  '/issues/:id',
  isAuthenticated,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      // code to update an issue
      await Issue.findOne({ _id: req.params.id }).then((issue) => {
        if (issue === null || issue === undefined) {
          next({ status: 401, message: 'Issue not found in DB' })
          return
        }
        res.status(200).json(issue)
      })
    }
  ) as RequestHandler
)

issuesRouter.put(
  '/issues/:id',
  isAuthenticated,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      // code to update an issue
      await Issue.replaceOne({ _id: req.params.id }, req.body).then(() => {
        res.status(200).json({ message: 'Issue updated' })
      })
    }
  ) as RequestHandler
)

export default issuesRouter
