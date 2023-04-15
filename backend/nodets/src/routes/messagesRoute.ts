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

const messagesRouter = express.Router()

messagesRouter.get(
  '/issues/:id/messages',
  isAuthenticated,
  issuesRouter,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('test')
      const messages = await Message.find({ issue: req.params.id }).sort({
        created_at: -1
      })
      res.json(messages)
    } catch (error) {
      next(error)
    }
  }) as RequestHandler
)

export default messagesRouter
