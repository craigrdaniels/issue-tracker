import {
  type RequestHandler,
  type NextFunction,
  type Request,
  type Response
} from 'express'
import express from 'express'
import isAuthenticated from '../helpers/authHelper.js'
import Message from '../models/messageModel.js'
import issuesRouter from './issuesRoute.js'
import { findIssueById, getUserIdByEmail } from '../helpers/dbHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'

const messagesRouter = express.Router()

messagesRouter.get(
  '/issues/:issueID/messages',
  isAuthenticated,
  issuesRouter,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const messages = await Message.find({ issue: req.params.issueID }).sort({
        created_at: -1
      })
      res.status(200).json(messages)
    }
  ) as RequestHandler
)

messagesRouter.get(
  '/issues/:issueID/messages/:messageID',
  isAuthenticated,
  issuesRouter,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const message = await Message.findOne({ _id: req.params.messageID })
      res.status(200).json(message)
    }
  ) as RequestHandler
)

// create a new message
messagesRouter.post(
  '/issues/:issueID/messages',
  isAuthenticated,
  issuesRouter,
  getUserIdByEmail,
  findIssueById,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const message = new Message({
        content: req.body.content,
        created_by: req._id,
        issue: req.params.issueID
      })
      await message.save()
      res.status(200).json({ success: true, message: 'Message created' })
    }
  ) as RequestHandler
)

// edit a message
messagesRouter.put(
  '/issues/:issueID/messages/:messageID',
  isAuthenticated,
  issuesRouter,
  findIssueById,
  catchAsyncFunction(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await Message.replaceOne({ _id: req.params.messageID }, req.body).then(
        () => {
          res.status(200).json({ success: true, message: 'Message updated' })
        }
      )
    }
  ) as RequestHandler
)

export default messagesRouter
