import type { Request, Response, NextFunction } from 'express'
import type { PipelineStage } from 'mongoose'
import mongoose from 'mongoose'
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
    const pipeline: PipelineStage[] = [
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

    const issues: IIssue[] = await Issue.aggregate(pipeline)

    res.status(200).json(issues)
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

    res.status(200).json(issue[0])
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
