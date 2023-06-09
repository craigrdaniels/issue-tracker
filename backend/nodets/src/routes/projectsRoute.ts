import express from 'express'
import { checkJwt } from '../helpers/authHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
import ProjectController from '../controllers/ProjectController.js'
import issuesRouter from './issuesRoute.js'
import { getUserIdByEmail } from '../helpers/dbHelpers.js'

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

projectsRouter.post(
  '/',
  [checkJwt, catchAsyncFunction(getUserIdByEmail)],
  catchAsyncFunction(ProjectController.newProject)
)

projectsRouter.use('/:id/issues', issuesRouter)

export default projectsRouter
