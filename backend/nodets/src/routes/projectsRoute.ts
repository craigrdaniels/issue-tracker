import express from 'express'
import { checkJwt } from '../helpers/authHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'
import ProjectController from '../controllers/ProjectController.js'

const projectsRouter = express.Router()

projectsRouter.get(
  '/projects',
  [checkJwt],
  catchAsyncFunction(ProjectController.getAll)
)

projectsRouter.get(
  '/projects/:id',
  [checkJwt],
  catchAsyncFunction(ProjectController.getOneById)
)

export default projectsRouter
