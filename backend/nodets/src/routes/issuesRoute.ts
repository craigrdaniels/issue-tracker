import express from 'express'
import { checkJwt } from '../helpers/authHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
import IssueController from '../controllers/IssueController.js'

const issuesRouter = express.Router()

issuesRouter.get(
  '/issues',
  [checkJwt],
  catchAsyncFunction(IssueController.getAll)
)

issuesRouter.post(
  '/issues',
  [checkJwt],
  catchAsyncFunction(IssueController.newIssue)
)

issuesRouter.get(
  '/issues/:id',
  [checkJwt],
  catchAsyncFunction(IssueController.getOneById)
)

issuesRouter.put(
  '/issues/:id',
  [checkJwt],
  catchAsyncFunction(IssueController.editIssue)
)

export default issuesRouter
