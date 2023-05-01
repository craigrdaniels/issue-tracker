import express from 'express'
import ActionController from '../controllers/ActionController.js'
import { checkJwt } from '../helpers/authHelpers.js'
import { getUserIdByEmail } from '../helpers/dbHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'

const actionsRouter = express.Router()

actionsRouter.get(
  '/issues/:issueID/actions',
  [checkJwt],
  catchAsyncFunction(ActionController.getAll)
)

actionsRouter.get(
  '/issues/:issueID/actions/:actionID',
  catchAsyncFunction(ActionController.getOneById)
)

actionsRouter.post(
  '/issues/:issueID/actions',
  [checkJwt, getUserIdByEmail],
  catchAsyncFunction(ActionController.newAction)
)

actionsRouter.put(
  '/issues/:issueID/actions/:actionID',
  [checkJwt, getUserIdByEmail],
  catchAsyncFunction(ActionController.editAction)
)

actionsRouter.delete(
  '/issues/:issueID/actions/:actionID',
  [checkJwt],
  catchAsyncFunction(ActionController.deleteAction)
)

export default actionsRouter
