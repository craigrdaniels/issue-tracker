import type { Request, Response, NextFunction } from 'express'
import Message from '../models/messageModel.js'
import type { IMessage } from '../models/messageModel.js'

class MessageController {
  static getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const messages: IMessage[] = await Message.find({
      issue: req.params.issueID
    }).sort({
      created_at: -1
    })
    res.status(200).json(messages)
  }

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const message: IMessage | null = await Message.findById(
      req.params.messageID
    )

    if (message === null || message === undefined) {
      throw new Error('Message not found')
    }

    res.status(200).json(message)
  }

  static newMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    console.log(req.body)
    const message: IMessage = new Message({
      content: req.body.content,
      issue: req.params.issueID,
      created_by: req._id
    })
    const _message: IMessage | null = await message.save()
    res.status(200).json(_message)
  }

  static editMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const message: IMessage | null = await Message.findByIdAndUpdate(
      req.params.messageID,
      req.body
    )

    if (message === null || message === undefined) {
      throw new Error('Message not found')
    }

    res.status(200).json(message)
  }
}

export default MessageController
