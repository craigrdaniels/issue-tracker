import type { Request, Response, NextFunction } from 'express'
import type { PipelineStage } from 'mongoose'
import mongoose from 'mongoose'
import Issue from '../models/issueModel.js'
import type { IIssue } from '../models/issueModel.js'
import Message from '../models/messageModel.js'
import type { IMessage } from '../models/messageModel.js'
import type { ITag } from '../models/tagModel.js'
import Tag from '../models/tagModel.js'

class IssueController {
  static getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const projectId =
      req.params.id !== undefined
        ? new mongoose.Types.ObjectId(req.params.id)
        : null

    let pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'issue',
          as: 'messages'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assigned_users',
          foreignField: '_id',
          as: 'assigned_users'
        }
      },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: '_id',
          as: 'tags'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          as: 'created_by'
        }
      },
      {
        $set: {
          created_by: {
            $first: '$created_by'
          }
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $set: {
          project: {
            $first: '$project'
          }
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          created_at: 1,
          is_open: 1,
          'tags._id': 1,
          'tags.tag': 1,
          'tags.color': 1,
          'created_by._id': 1,
          'created_by.username': 1,
          'project._id': 1,
          'project.name': 1,
          'assigned_users._id': 1,
          'assigned_users.username': 1,
          message_count: {
            $size: '$messages'
          }
        }
      }
    ]

    if (projectId !== null) {
      pipeline = [
        {
          $match: {
            project: projectId
          }
        },
        ...pipeline
      ]
    }

    const issues: IIssue[] = await Issue.aggregate(pipeline)

    setTimeout(() => {
      res.status(200).json(issues)
    }, 1000)
  }

  static getOneById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $limit: 1
      },
      {
        $lookup: {
          from: 'users',
          localField: 'created_by',
          foreignField: '_id',
          as: 'created_by'
        }
      },
      {
        $set: {
          created_by: {
            $first: '$created_by'
          }
        }
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'project',
          foreignField: '_id',
          as: 'project'
        }
      },
      {
        $set: {
          project: {
            $first: '$project'
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'assigned_users',
          foreignField: '_id',
          as: 'assigned_users'
        }
      },
      {
        $lookup: {
          from: 'tags',
          localField: 'tags',
          foreignField: '_id',
          as: 'tags'
        }
      },
      {
        $lookup: {
          from: 'messages',
          let: {
            issue_id: '$_id'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$issue', '$$issue_id']
                }
              }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'created_by',
                foreignField: '_id',
                as: 'created_by'
              }
            },
            {
              $set: {
                created_by: {
                  $first: '$created_by'
                }
              }
            },
            {
              $sort: {
                created_at: 1
              }
            },
            {
              $project: {
                _id: 1,
                content: 1,
                created_at: 1,
                'created_by._id': 1,
                'created_by.username': 1,
                last_edit: 1
              }
            }
          ],
          as: 'messages'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          'tags._id': 1,
          'tags.tag': 1,
          'tags.color': 1,
          'created_by._id': 1,
          'created_by.username': 1,
          'project._id': 1,
          'project.name': 1,
          'assigned_users._id': 1,
          'assigned_users.username': 1,
          messages: 1
        }
      }
    ]

    const issue: IIssue[] = await Issue.aggregate(pipeline)

    setTimeout(() => {
      res.status(200).json(issue[0])
    }, 1000)
  }

  static newIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const issue: IIssue = new Issue({
      title: req.body.title,
      created_by: req._id,
      project: req.body.project
    })
    await issue.save()

    const message: IMessage = new Message({
      content: req.body.content,
      issue: issue._id.toString(),
      created_by: req._id
    })

    await message.save()
    res
      .status(200)
      .json({ success: true, message: 'Issue created', id: issue._id })
  }

  static editIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const issue: IIssue | null = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body
    )
    res.status(200).json(issue)
  }

  static tagIssue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // first check if tag exists in database
    const tag: ITag | null = await Tag.findOne({ tag: req.body.tag })

    if (tag === null || tag === undefined) {
      const newTag: ITag = new Tag({ tag: req.body.tag })

      const _tag: ITag | null = await newTag.save()

      const issue: IIssue | null = await Issue.findByIdAndUpdate(
        req.params.id,
        { $push: { tags: _tag._id } }
      )

      res.status(200).json(issue)
    } else {
      const issue: IIssue | null = await Issue.findByIdAndUpdate(
        req.params.id,
        { $push: { tags: tag._id } }
      )

      res.status(200).json(issue)
    }
  }
}

export default IssueController
