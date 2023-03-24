import { type Request, type Response, type NextFunction } from 'express'
import express from 'express'

const router = express.Router()

// Get all messages
router.get('/', async (req: Request, res: Response, next: NextFunction) => {})

export default router
