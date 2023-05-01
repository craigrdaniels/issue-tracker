// reduce try / catch statements in exppress routes
// adpated from :
// blog.qoddi.com/better-way-to-write-async-function-in-node-express-next-handle-catch-err-only-once/
import type { Request, Response, NextFunction, RequestHandler } from 'express'

const catchAsyncFunction =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next)

export default catchAsyncFunction
