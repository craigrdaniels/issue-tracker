import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'
import messagesRouter from '../messagesRoute.js'
import User from '../../models/userModel.js'
import Issue from '../../models/issueModel.js'
import Message from '../../models/messageModel.js'

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
  it('get all messages', async () => {
    const response = await request(app)
      .get('/issues/' + testData.issue._id + '/messages')
      .set('Content-Type', 'applications/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
    expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1)
  })
  it('get individual message', async () => {
    const response = await request(app)
      .get(
        '/issues/' + testData.issue._id + '/messages/' + testData.message._id
      )
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
    expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1)
  })
  it('create a new message', async () => {
    const response = await request(app)
      .post('/issues/' + testData.issue._id + '/messages')
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
      .send({
        content: 'Test Content'
      })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
  it('update a message', async () => {
    const response = await request(app)
      .put(
        '/issues/' + testData.issue._id + '/messages/' + testData.message._id
      )
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
      .send({
        content: 'New Test Content'
      })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})
