import { type NextFunction, type Request, type Response } from 'express'
import express from 'express'
import Issue from '../models/issue.js'

const issuesRouter = express.Router()

// Get all issues
issuesRouter.get(
  '/issues',
  (req: Request, res: Response, next: NextFunction): void => {
    void (async (): Promise<void> => {
      try {
        const issues = await Issue.find().sort({ added: -1 }).limit(150)
        res.json(issues)
      } catch (error) {
        console.log(error)
        next(error)
      }
    })()
  }
)

issuesRouter.post('/issues', (req: Request, res: Response): void => {
  // code to add a new issue
  res.json(req.body)
})

issuesRouter.put('/issues/:id', (req: Request, res: Response): void => {
  // code to update an issue
  res.json(req.body)
})

issuesRouter.delete('/issues/:id', (req: Request, res: Response): void => {
  // code to delete an issue
  res.json(req.body)
})

export default issuesRouter
