import type { Request, Response, NextFunction } from 'express'
import Action from '../models/actionModel.js'
import type { IAction } from '../models/actionModel.js'

class ActionController {
  static getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const actions: IAction[] = await Action.find({
      issue: req.params.issueID
    }).sort({ created_at: -1 })
    res.status(200).json(actions)
  }

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const action: IAction | null = await Action.findById(req.params.actionID)

    if (action === null || action === undefined) {
      throw new Error('Action not found')
    }

    res.status(200).json(action)
  }

  static newAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const action: IAction = new Action(req.body, {
      issue: req.params.issueID,
      created_by: req.params.userID
    })
    const _action: IAction | null = await action.save()
    res.status(200).json(_action)
  }

  static editAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const action: IAction | null = await Action.findByIdAndUpdate(
      req.params.actionID,
      req.body
    )

    if (action === null || action === undefined) {
      throw new Error('Action not found')
    }

    res.status(200).json(action)
  }

  static deleteAction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await Action.findByIdAndDelete(req.params.actionID)

    res.status(200).json({ success: true, message: 'Action deleted' })
  }
}

export default ActionController
