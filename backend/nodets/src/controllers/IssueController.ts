import type { Request, Response, NextFunction } from 'express'
import Issue from '../models/issueModel.js'
import type { IIssue } from '../models/issueModel.js'
import User from '../models/userModel.js'
import type { IUser } from '../models/userModel.js'

class IssueController {
  static getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const issues: IIssue[] = await Issue.find().sort({ added: -1 })
    res.status(200).json(issues)
  }

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const issue: IIssue | null = await Issue.findById(req.params.id)
    res.status(200).json(issue)
  }

  static newIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user: IUser | null = await User.findOne({ email: req.email })

    if (user === null || user === undefined) throw new Error('User not found')

    const issue: IIssue = new Issue(req.body, { created_by: user._id })
    await issue.save()
    res.status(200).json({ success: true, message: 'Issue created' })
  }

  static editIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const issue: IIssue | null = await Issue.findByIdAndUpdate(
      req.params.issueID,
      req.body
    )
    res.status(200).json(issue)
  }
}

export default IssueController
