import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'
import issuesRouter from '../issuesRoute.js'

beforeAll(async () => {
  await connectDB()
  await testData.user.save()
  await testData.refreshToken.save()
})
afterEach(async () => {
  await dropCollections()
})
afterAll(async () => {
  await dropDB()
})

const app = express()
app.use(issuesRouter)

describe('GET /', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .get('/issues')
      .set('Accept', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
    console.log(response.body)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
  it('should return issues', async () => {
    // const response = await request(baseUrl).get('/')
    // console.log(response)
    // expect(response.body.data.length).toBeGreaterThanOrEqual(1)
  })
})

// Commented out sections do not work until push functions added
