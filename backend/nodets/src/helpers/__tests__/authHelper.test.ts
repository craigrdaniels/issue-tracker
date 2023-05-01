import { jest } from '@jest/globals'
import { type Request, type Response, type NextFunction } from 'express'
import { checkJwt } from '../authHelpers.js'
import * as testData from '../../db/testData.js'

describe('authHelper middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequest = {}
    mockResponse = {
      // @ts-expect-error wrong types
      json: jest.fn(),
      // @ts-expect-error wrong types
      status: jest.fn().mockReturnThis()
    }
  })

  it('without cookies', async () => {
    const expectedResponse = {
      success: false,
      message: 'Missing or invalid refresh token'
    }
    mockRequest = {}
    await checkJwt(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })
  it('without JWT cookies', async () => {
    const expectedResponse = {
      success: false,
      message: 'Missing or invalid refresh token'
    }
    mockRequest = {
      cookies: {}
    }
    await checkJwt(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )

    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })
  it('with JWT cookie', async () => {
    mockRequest = {
      cookies: {
        JWT: testData.token
      }
    }
    await checkJwt(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(nextFunction).toBeCalledTimes(1) // fails
  })
  it('with refreshToken only', async () => {
    mockRequest = {
      cookies: {
        refreshToken: testData.refreshToken
      }
    }
    await checkJwt(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    )
    expect(nextFunction).toBeCalledTimes(1)
  })
})
