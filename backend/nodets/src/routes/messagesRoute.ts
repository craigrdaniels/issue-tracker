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

const messagesRouter = express.Router()

messagesRouter.get(
  '/issues/:issueID/messages',
  isAuthenticated,
  issuesRouter,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const messages = await Message.find({ issue: req.params.issueID }).sort({
        created_at: -1
      })
      res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

messagesRouter.get(
  '/issues/:issueID/messages/:messageID',
  isAuthenticated,
  issuesRouter,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = await Message.findOne({ _id: req.params.messageID })
      res.status(200).json(message)
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

// create a new message
messagesRouter.post(
  '/issues/:issueID/messages',
  isAuthenticated,
  issuesRouter,
  getUserIdByEmail,
  findIssueById,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const message = new Message({
        content: req.body.content,
        created_by: req._id,
        issue: req.params.issueID
      })
      await message.save()
      res.status(200).json({ success: true, message: 'Message created' })
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

// edit a message
messagesRouter.put(
  '/issues/:issueID/messages/:messageID',
  isAuthenticated,
  issuesRouter,
  findIssueById,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Message.replaceOne({ _id: req.params.messageID }, req.body).then(
        () => {
          res.status(200).json({ success: true, message: 'Message updated' })
        }
      )
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

export default messagesRouter
