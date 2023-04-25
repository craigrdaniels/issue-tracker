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
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })

  it('test user should be able to login', async () => {
    const response = await request(app)
      .post('/users/login')
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
      .post('/users/login')
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
      .post('/users/login')
      .send({
        email: 'unregisteredUser@domain.com',
        password: 'mypass'
      })
      .set('Accept', 'application/json')
    expect(response.statusCode).not.toBe(200)
    expect(response.error).not.toBe(false)
  })
  it('test user can refresh token', async () => {
    const response = await request(app)
      .post('/users/refresh-token')
      .send({
        email: testData.user.email,
        token: testData.refreshToken.token
      })
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
    expect(response.body.token).not.toEqual(testData.refreshToken.token)
  })
  it('test user can delete token', async () => {
    const response = await request(app)
      .delete('/users/refresh-token')
      .send({
        email: testData.user.email,
        token: testData.refreshToken.token
      })
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
  it('User can update details', async () => {
    const response = await request(app)
      .put('/users/update')
      .set('Cookie', [`JWT=${testData.token}`])
      .send({
        username: 'New Username'
      })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})
