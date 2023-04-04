import {
  type RequestHandler,
  type NextFunction,
  type Request,
  type Response
} from 'express'
import express from 'express'
import isAuthenticated from '../helpers/authHelper.js'
import Issue from '../models/issueModel.js'

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
    console.log(error)
    next(error)
  }
}) as RequestHandler)

issuesRouter.post('/issues', isAuthenticated, (async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // code to add a new issue
  console.log(req.body)
  if (req.body?.user === undefined || req.body?.user.trim().length < 1) {
    next({ status: 400, message: 'User is undefined' })
    return
  }
  if (req.body?.title === undefined || req.body?.title.trim().length < 1) {
    next({ status: 400, message: 'Title is undefined' })
    return
  }
  const issue = new Issue({
    // BUG: #4 Issue validation failed
    title: req.body.title,
    created_by: req.body.user,
    project: req.body.project,
    tags: req.body.tags
  })
  await issue.save()
  res.status(200).json({ success: true, message: 'Issue created' })
}) as RequestHandler)

issuesRouter.put('/issues/:id', (req: Request, res: Response): void => {
  // code to update an issue
  res.json(req.body)
})

issuesRouter.delete('/issues/:id', (req: Request, res: Response): void => {
  // code to delete an issue
  res.json(req.body)
})

export default issuesRouter
