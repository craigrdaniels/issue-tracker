// reduce try / catch statements in exppress routes
// adpated from :
// blog.qoddi.com/better-way-to-write-async-function-in-node-express-next-handle-catch-err-only-once/
import type { Request, Response, NextFunction } from 'express'

const catchAsyncFunction =
  (asyncFunction: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    asyncFunction(req, res, next).catch(next)
  }

export default catchAsyncFunction
