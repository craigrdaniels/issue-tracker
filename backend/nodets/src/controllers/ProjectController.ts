import type { Request, Response, NextFunction } from 'express'
import type { PipelineStage } from 'mongoose'
import Project from '../models/projectModel.js'
import type { IProject } from '../models/projectModel.js'

class ProjectController {
  static getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'project_lead',
          foreignField: '_id',
          as: 'project_lead'
        }
      },
      {
        $set: {
          project_lead: {
            $first: '$project_lead'
          }
        }
      },
      {
        $lookup: {
          from: 'issues',
          localField: '_id',
          foreignField: 'project',
          pipeline: [
            {
              $match: {
                is_open: true
              }
            }
          ],
          as: 'issues'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          'project_lead._id': 1,
          'project_lead.username': 1,
          open_issues: {
            $size: '$issues'
          }
        }
      }
    ]

    const projects: IProject[] = await Project.aggregate(pipeline)

    res.status(200).json(projects)
  }
}

export default ProjectController
