import { type NextFunction, type Request, type Response } from 'express'
import express from 'express'
import Issue from '../models/issue.js'

const indexRouter = express.Router()

indexRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction): void => {
    void (async (): Promise<void> => {
      try {
        // get stats
        console.log('Counting')
        const issuesCount = await Issue.countDocuments({})
        console.log('Issues: ', issuesCount)
        res.json({ issues: issuesCount })
      } catch (error) {
        console.log(error)
        next(error)
      }
    })()
  }
)
export default indexRouter
