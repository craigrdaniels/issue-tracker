import {
  type RequestHandler,
  type NextFunction,
  type Request,
  type Response
} from 'express'
import express from 'express'
import isAuthenticated from '../helpers/authHelper.js'
import Action from '../models/actionModel.js'
import issuesRouter from './issuesRoute.js'
import { findIssueById, getUserIdByEmail } from '../helpers/dbHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'

const actionsRouter = express.Router()

// get actions for specified issues
actionsRouter.get(
  '/issues/:issueID/actions',
  isAuthenticated,
  issuesRouter,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const actions = await Action.find({ issue: req.params.issueID }).sort({
        created_at: -1
      })
      res.status(200).json(actions)
    }
  ) as RequestHandler
)

// get specified action
actionsRouter.get(
  '/issues/:issueID/actions/:actionID',
  issuesRouter,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const action = await Action.findOne({ _id: req.params.actionID })
      res.status(200).json(action)
    }
  ) as RequestHandler
)

// create a new action
actionsRouter.post(
  '/issues/:issueID/actions',
  isAuthenticated,
  issuesRouter,
  getUserIdByEmail,
  findIssueById,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const action = new Action({
        action: req.body.action,
        user: req._id,
        issue: req.params.issueID
      })
      await action.save()
      res.status(200).json({ success: true, message: 'Action created' })
    }
  ) as RequestHandler
)

// delete an action
actionsRouter.delete(
  '/issues/:issueID/actions/:actionID',
  isAuthenticated,
  issuesRouter,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await Action.findOneAndRemove({ _id: req.params.actionID }).then(
        (action) => {
          if (action === null || action === undefined) {
            next({ status: 400, message: 'Action not found' })
            return
          }
          res.status(200).json({ success: true, message: 'Action Removed' })
        }
      )
    }
  ) as RequestHandler
)

export default actionsRouter
