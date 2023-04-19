import { jest } from '@jest/globals'
import type { Request, Response, NextFunction } from 'express'
import { connectDB, dropDB } from '../../db/testdb.js'
import { getUserIdByEmail } from '../dbHelpers.js'
import * as testData from '../../db/testData.js'
import User from '../../models/userModel.js'

describe('db Helper functions', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeAll(async () => {
    await connectDB()
    await User.create(testData.user)
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
})
