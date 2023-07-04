import express from 'express'
import TagController from '../controllers/TagController.js'
import { checkJwt } from '../helpers/authHelpers.js'
import catchAsyncFunction from '../helpers/catchAsyncFunction.js'

const tagsRouter = express.Router()

tagsRouter.get('/tags', [checkJwt], catchAsyncFunction(TagController.getAll))

tagsRouter.get(
  '/tags/:tagID',
  [checkJwt],
  catchAsyncFunction(TagController.getOneByID)
)

tagsRouter.post('/tags', [checkJwt], catchAsyncFunction(TagController.newTag))

tagsRouter.put(
  '/tags/:tagID',
  [checkJwt],
  catchAsyncFunction(TagController.editTag)
)

tagsRouter.delete(
  '/tags/:tagID',
  [checkJwt],
  catchAsyncFunction(TagController.deleteTag)
)

export default tagsRouter
