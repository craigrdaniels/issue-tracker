import express from 'express'
import MessageController from '../controllers/MessageController.js'
import { checkJwt } from '../helpers/authHelpers.js'
import { findIssueById, getUserIdByEmail } from '../helpers/dbHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'

const messagesRouter = express.Router()

messagesRouter.get(
  '/issues/:issueID/messages',
  [checkJwt],
  catchAsyncFunction(MessageController.getAll)
)

messagesRouter.get(
  '/issues/:issueID/messages/:messageID',
  [checkJwt],
  catchAsyncFunction(MessageController.getOneById)
)

messagesRouter.post(
  '/issues/:issueID/messages',
  [checkJwt, catchAsyncFunction(getUserIdByEmail)],
  catchAsyncFunction(MessageController.newMessage)
)

// edit a message
messagesRouter.put(
  '/issues/:issueID/messages/:messageID',
  [checkJwt, catchAsyncFunction(findIssueById)],
  catchAsyncFunction(MessageController.editMessage)
)

export default messagesRouter
