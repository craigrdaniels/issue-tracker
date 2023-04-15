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

const issuesRouter = express.Router()

// Get all issues
issuesRouter.get('/issues', isAuthenticated, (async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const issues = await Issue.find().sort({ added: -1 }).limit(150)
    res.json(issues)
  } catch (error) {
    next(error)
  }
}) as RequestHandler)

// create a new issue
issuesRouter.post('/issues', isAuthenticated, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error)
  }
}) as RequestHandler)

issuesRouter.get('/issues/:id', isAuthenticated, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // code to update an issue
  res.json(req.body)
}) as RequestHandler)

issuesRouter.put('/issues/:id', isAuthenticated, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // code to update an issue
  res.json(req.body)
}) as RequestHandler)

issuesRouter.delete('/issues/:id', (req: Request, res: Response): void => {
  // code to delete an issue
  res.json(req.body)
})

export default issuesRouter
