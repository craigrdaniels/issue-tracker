import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'
import actionsRouter from '../actionsRoute.js'
import User from '../../models/userModel.js'
import Issue from '../../models/issueModel.js'
import Action from '../../models/actionModel.js'

const app = express()
app.use(express.json())
app.use(actionsRouter)

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
  await Action.replaceOne({}, testData.action, {
    upsert: true
  })
})
afterEach(async () => {
  await dropCollections()
})

afterAll(async () => {
  await dropDB()
})

describe('Test actions router', () => {
  it('get all actions', async () => {
    const response = await request(app)
      .get('/issues/' + testData.issue._id + '/actions')
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(200)
    expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1)
  })
  it('get individual action', async () => {
    const response = await request(app)
      .get('/issues/' + testData.issue._id + '/actions/' + testData.action._id)
      .set('Content-Type', 'applications/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(200)
    expect(Object.keys(response.body).length).toBeGreaterThanOrEqual(1)
  })
  it('create a new action', async () => {
    const response = await request(app)
      .post('/issues/' + testData.issue._id + '/actions')
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
      .send({
        action: 'Test Action'
      })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
  it('delete an action', async () => {
    const response = await request(app)
      .delete(
        '/issues/' + testData.issue._id + '/actions/' + testData.action._id
      )
      .set('Content-Type', 'application/json')
      .set('Authorization', `JWT ${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})
