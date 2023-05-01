import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import cookieParser from 'cookie-parser'
import * as testData from '../../db/testData.js'
import authRouter from '../authRoute.js'
import User from '../../models/userModel.js'
import RefreshToken from '../../models/refreshTokenModel.js'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(authRouter)

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

describe('Auth Functions', () => {
  it('test user should be able to login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: testData.user.email,
        password: 'password'
      })
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
  it('test user should not be able to login with incorrect pass', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: testData.user.email,
        password: 'wrong-password'
      })
      .set('Accept', 'application/json')
    expect(response.statusCode).not.toBe(200)
    expect(response.error).not.toBe(false)
  })

  it('unregistered users should not be able to login', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'unregisteredUser@domain.com',
        password: 'mypass'
      })
      .set('Accept', 'application/json')
    expect(response.statusCode).not.toBe(200)
    expect(response.error).not.toBe(false)
  })
  it('test user can logout', async () => {
    const response = await request(app).post('/logout').send({
      email: testData.user.email,
      token: testData.refreshToken.token
    })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})
