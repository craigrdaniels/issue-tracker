import {
  type RequestHandler,
  type NextFunction,
  type Request,
  type Response
} from 'express'
import express from 'express'
import isAuthenticated from '../helpers/authHelper.js'
import Action from '../models/actionModel.js'
import User from '../models/userModel.js'
import Issue from '../models/issueModel.js'
import issuesRouter from './issuesRoute.js'

const actionsRouter = express.Router()

// get actions for specified issues
actionsRouter.get(
  '/issues/:issueID/actions',
  isAuthenticated,
  issuesRouter,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const actions = await Action.find({ issue: req.params.issueID }).sort({
        created_at: -1
      })
      res.status(200).json(actions)
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

// get specified action
actionsRouter.get('/issues/:issueID/actions/:actionID', issuesRouter, (async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const action = await Action.findOne({ _id: req.params.actionID })
    res.status(200).json(action)
  } catch (error) {
    next(error)
  }
}) as RequestHandler)

// create a new action
actionsRouter.post(
  '/issues/:issueID/actions',
  isAuthenticated,
  issuesRouter,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await User.findOne({ email: req.email }).then(async (user) => {
        if (user === null || user === undefined) {
          next({ status: 400, message: 'User not found' })
          return
        }
        await Issue.findOne({ _id: req.params.issueID }).then(async (issue) => {
          if (issue === null || issue === undefined) {
            next({ status: 400, message: 'Issue not found' })
            return
          }
          const action = new Action({
            action: req.body.action,
            user: user._id,
            issue: issue._id
          })
          await action.save()
          res.status(200).json({ success: true, message: 'Action created' })
        })
      })
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

// delete an action
actionsRouter.delete(
  '/issues/:issueID/actions/:actionID',
  isAuthenticated,
  issuesRouter,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Action.findOneAndRemove({ _id: req.params.actionID }).then(
        (action) => {
          if (action === null || action === undefined) {
            next({ status: 400, message: 'Action not found' })
            return
          }
          res.status(200).json({ success: true, message: 'Action Removed' })
        }
      )
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

export default actionsRouter
