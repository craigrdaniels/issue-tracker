import {
  type RequestHandler,
  type NextFunction,
  type Request,
  type Response
} from 'express'
import express from 'express'
import isAuthenticated from '../helpers/authHelper.js'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Issue from '../models/issueModel.js'
import issuesRouter from './issuesRoute.js'

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
          const message = new Message({
            content: req.body.content,
            created_by: user._id,
            issue: issue._id
          })
          await message.save()
          res.status(200).json({ success: true, message: 'Message created' })
        })
      })
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
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Issue.findOne({ _id: req.params.issueID }).then(async (issue) => {
        if (issue === null || issue === undefined) {
          next({ status: 400, message: 'Issue not found' })
          return
        }
        await Message.replaceOne({ _id: req.params.messageID }, req.body).then(
          () => {
            res.status(200).json({ success: true, message: 'Message updated' })
          }
        )
      })
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

export default messagesRouter
