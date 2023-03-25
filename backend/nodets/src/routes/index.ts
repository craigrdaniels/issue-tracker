import { type Request, type Response } from 'express'
import express from 'express'
import Issue from '../models/issue.js'

const router = express.Router()

// Get all messages
router.get('/', (req: Request, res: Response): void => {
  void (async (): Promise<void> => {
    try {
      const issues = await Issue.find().sort({ added: -1 }).limit(150)
      res.json(issues)
    } catch (error) {
      console.log(error)
    }
  })()
})

export default router
