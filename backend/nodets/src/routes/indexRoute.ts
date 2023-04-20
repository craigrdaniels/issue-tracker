import {
  type NextFunction,
  type Request,
  type Response,
  type RequestHandler
} from 'express'
import express from 'express'
import Issue from '../models/issueModel.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
// Display a welcome message and show open issues count

const indexRouter = express.Router()

const message = 'Welcome to the Issue Tracker!'

indexRouter.get(
  '/',
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction) => {
      // get stats
      const issuesCount = await Issue.countDocuments({})
      const openIssuesCount = await Issue.countDocuments({ is_open: true })
      res.json({
        message,
        issues: { open: openIssuesCount, total: issuesCount }
      })
    }
  ) as RequestHandler
)
export default indexRouter
