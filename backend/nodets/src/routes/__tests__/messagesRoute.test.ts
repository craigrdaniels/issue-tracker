import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'
import messagesRouter from '../messagesRoute.js'
import User from '../../models/userModel.js'
import Issue from '../../models/issueModel.js'
import Message from '../../models/messageModel.js'
import issuesRouter from 'routes/issuesRoute.js'

const app = express()
app.use(express.json())
app.use(messagesRouter)

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
  await Message.replaceOne({}, testData.message, {
    upsert: true
  })
})
afterEach(async () => {
  await dropCollections()
})

afterAll(async () => {
  await dropDB()
})

describe('Get /messages for an issue', () => {
  it('shoudl return 200', async () => {
    const response = await request(app)
      .get('/issues/' + testData.issue._id + '/messages')
      .set('Content-Type', 'applications/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
    expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1)
  })
})
