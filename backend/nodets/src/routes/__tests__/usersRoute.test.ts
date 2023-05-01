import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import cookieParser from 'cookie-parser'
import * as testData from '../../db/testData.js'
import usersRouter from '../usersRoute.js'
import User from '../../models/userModel.js'
import RefreshToken from '../../models/refreshTokenModel.js'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(usersRouter)

beforeAll(async () => {
  await connectDB()
})

beforeEach(async () => {
  await User.replaceOne({ email: testData.user.email }, testData.user, {
    upsert: true
  })
  await RefreshToken.replaceOne(
    { email: testData.refreshToken.email },
    testData.refreshToken,
    { upsert: true }
  )
})

afterEach(async () => {
  await dropCollections()
})
afterAll(async () => {
  await dropDB()
})

describe('User Functions', () => {
  it('create new user', async () => {
    const response = await request(app)
      .post('/users/signup')
      .set('Accept', 'application/json')
      .send({
        email: 'user@domain.com',
        username: 'user',
        password: 'super-secret-password'
      })
    expect(response.statusCode).toBe(201)
    expect(response.error).toBe(false)
  })

  it('User can update details', async () => {
    const response = await request(app)
      .put('/users/update')
      .set('Cookie', [`JWT=${testData.token}`])
      .send({
        username: 'New Username'
      })
    expect(response.statusCode).toBe(204)
    expect(response.error).toBe(false)
  })
})
