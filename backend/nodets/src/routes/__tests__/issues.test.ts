import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'
import issuesRouter from '../issuesRoute.js'
import User from '../../models/userModel.js'
import Issue from '../../models/issueModel.js'

const app = express()
app.use(express.json())
app.use(issuesRouter)

beforeAll(async () => {
  await connectDB()
})
beforeEach(async () => {
  await User.replaceOne({ email: testData.user.email }, testData.user, {
    upsert: true
  })
  await Issue.replaceOne({}, testData.issue, {
    upsert: true
  })
})
afterEach(async () => {
  await dropCollections()
})

afterAll(async () => {
  await dropDB()
})

describe('GET /issues', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .get('/issues')
      .set('Accept', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
    expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1)
  })
  it('should insert a new issue', async () => {
    const response = await request(app)
      .post('/issues')
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
      .send({
        title: 'Test issue'
      })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
  it('should return specified issue', async () => {
    const response = await request(app)
      .get('/issues/' + testData.issue._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
    expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1)
  })
  it('should update specified issue', async () => {
    const response = await request(app)
      .put('/issues/' + testData.issue._id)
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
      .send({ title: 'New Title' })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})
// Commented out sections do not work until push functions added
