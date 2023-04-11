import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'
import usersRouter from '../usersRoute.js'

const app = express()
app.use(express.json())
app.use(usersRouter)

beforeAll(async () => {
  await connectDB()
  await testData.user.save()
  await testData.refreshToken.save()
})
beforeEach(async () => {})
afterEach(async () => {
  //  await dropCollections()
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
    console.log(response.body)
    expect(response.statusCode).toBe(200)
  })
})
