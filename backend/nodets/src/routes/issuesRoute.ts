import express from 'express'
import { checkJwt } from '../helpers/authHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
import IssueController from '../controllers/IssueController.js'
import { getUserIdByEmail } from '../helpers/dbHelpers.js'

const issuesRouter = express.Router({ mergeParams: true })

issuesRouter.get('/', [checkJwt], catchAsyncFunction(IssueController.getAll))

issuesRouter.post(
  '/',
  [checkJwt, catchAsyncFunction(getUserIdByEmail)],
  catchAsyncFunction(IssueController.newIssue)
)

issuesRouter.get(
  '/:id',
  [checkJwt],
  catchAsyncFunction(IssueController.getOneById)
)

issuesRouter.put(
  '/:id',
  [checkJwt],
  catchAsyncFunction(IssueController.editIssue)
)

issuesRouter.put(
  '/:id/tag',
  [checkJwt],
  catchAsyncFunction(IssueController.tagIssue)
)

export default issuesRouter
