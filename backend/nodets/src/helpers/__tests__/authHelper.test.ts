import { jest } from '@jest/globals'
import { type Request, type Response, type NextFunction } from 'express'
import authHelper from '../authHelper.js'
import * as testData from '../../db/testData.js'

describe('authHelper middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      // @ts-expect-error wrong types
      json: jest.fn(),
      // @ts-expect-error wrong types
      status: jest.fn().mockReturnThis()
    }
  })

  it('without headers', async () => {
    const expectedResponse = {
      success: false,
      message: 'Token not found'
    }
    mockRequest = {}
    authHelper(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })
  it('without Authoriztaion headers', async () => {
    const expectedResponse = {
      success: false,
      message: 'Token not found'
    }
    mockRequest = {
      headers: {}
    }
    authHelper(mockRequest as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.json).toBeCalledWith(expectedResponse)
  })
  it('with Authoriztaion headers', async () => {
    mockRequest = {
      headers: {
        authorization: `JWT ${testData.token}`
      }
    }
  })
})
