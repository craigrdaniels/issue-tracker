import type { Request, Response, NextFunction } from 'express'
import Tag from '../models/tagModel.js'
import type { ITag } from '../models/tagModel.js'

class TagController {
  static getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tags: ITag[] = await Tag.find()
    res.status(200).json(tags)
  }

  static getOneByID = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tag: ITag | null = await Tag.findById(req.params.tagID)

    if (tag === null || tag === undefined) {
      throw new Error('Tag not found')
    }

    res.status(200).json(tag)
  }

  static newTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tag: ITag = new Tag(req.body)

    const _tag: ITag | null = await tag.save()
    res.status(200).json(_tag)
  }

  static editTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tag: ITag | null = await Tag.findByIdAndUpdate(
      req.params.tagID,
      req.body
    )

    if (tag === null || tag === undefined) {
      throw new Error('Tag not found')
    }

    res.status(200).json(tag)
  }

  static deleteTag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await Tag.findByIdAndDelete(req.params.tagID)

    res.status(200).json({ success: true, message: 'Tag delete' })
  }
}

export default TagController
