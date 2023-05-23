import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import { checkJwt } from '../helpers/authHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
import ProjectController from '../controllers/ProjectController.js'
import issuesRouter from './issuesRoute.js'
import IssueController from '../controllers/IssueController.js'

const projectsRouter = express.Router({ mergeParams: true })

projectsRouter.get(
  '/',
  [checkJwt],
  catchAsyncFunction(ProjectController.getAll)
)

projectsRouter.get(
  '/:id',
  [checkJwt],
  catchAsyncFunction(ProjectController.getOneById)
)

projectsRouter.use('/:id/issues', issuesRouter)

export default projectsRouter
