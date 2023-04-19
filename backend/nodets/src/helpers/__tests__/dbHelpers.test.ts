import { jest } from '@jest/globals'
import type { Request, Response, NextFunction } from 'express'
import { connectDB, dropDB } from '../../db/testdb.js'
import { findIssueById, getUserIdByEmail } from '../dbHelpers.js'
import * as testData from '../../db/testData.js'
import User from '../../models/userModel.js'
import Issue from '../../models/issueModel.js'

describe('db Helper functions', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeAll(async () => {
    await connectDB()
    await User.create(testData.user)
    await Issue.create(testData.issue)
  })

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      // @ts-expect-error wrong types
      json: jest.fn(),
      // @ts-expect-error wrong types
      status: jest.fn().mockReturnThis()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await dropDB()
  })

  it('getUserIdByEmail', async () => {
    mockRequest = {
      email: testData.user.email
    }
    await getUserIdByEmail(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(nextFunction).toBeCalledTimes(1)
  })
  it('getUserIdByEmail - incorrect address', async () => {
    const expectedResponse = {
      success: false,
      message: 'User not found'
    }
    mockRequest = {
      email: 'incorrect@email.com'
    }
    await getUserIdByEmail(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })
  it('getUserIdByEmail - no address give', async () => {
    const expectedResponse = {
      success: false,
      message: 'User not found'
    }
    mockRequest = {}
    await getUserIdByEmail(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })

  it('findIssueById - no id', async () => {
    const expectedResponse = {
      success: false,
      message: 'No issue ID given'
    }
    mockRequest = {}
    await findIssueById(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })

  it('findIssueByID', async () => {
    mockRequest = {
      params: { issueID: testData.issue._id }
    }
    await findIssueById(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(nextFunction).toBeCalledTimes(1)
  })

  it('findIssueByID - incorrect id', async () => {
    const mockIssue = new Issue({ content: 'Mock issue' })
    const expectedResponse = {
      success: false,
      message: 'Issue not found'
    }
    mockRequest = {
      params: { issueID: mockIssue._id }
    }
    await findIssueById(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })
})
