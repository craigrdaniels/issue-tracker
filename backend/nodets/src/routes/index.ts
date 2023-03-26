import { type NextFunction, type Request, type Response } from 'express'
import express from 'express'
import Issue from '../models/issue.js'

// Display a welcome message and show open issues count

const indexRouter = express.Router()

const message = 'Welcome to the Issue Tracker!'

indexRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction): void => {
    void (async (): Promise<void> => {
      try {
        // get stats
        const issuesCount = await Issue.countDocuments({})
        const openIssuesCount = await Issue.countDocuments({ is_open: true })
        res.json({
          message,
          issues: { open: openIssuesCount, total: issuesCount }
        })
      } catch (error) {
        console.log(error)
        next(error)
      }
    })()
  }
)
export default indexRouter
