import request from 'supertest'
import express from 'express'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import cookieParser from 'cookie-parser'
import * as testData from '../../db/testData.js'
import projectsRouter from '../projectsRoute.js'
import User from '../../models/userModel.js'
import Issue from '../../models/issueModel.js'
import Project from '../../models/projectModel.js'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(projectsRouter)

beforeAll(async () => {
  await connectDB()
})
beforeEach(async () => {
  await User.replaceOne({ email: testData.user.email }, testData.user, {
    upsert: true
  })
  await Project.replaceOne({}, testData.project, {
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

describe('Get /projects', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', 'application/json')
      .set('Cookie', `JWT=${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})

describe('Get /projects/:id', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .get(`/${testData.project._id}`)
      .set('Accept', 'application/json')
      .set('Cookie', `JWT=${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})

describe('Post /projects', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .post('/')
      .set('Content-Type', 'application/json')
      .set('Cookie', [`JWT=${testData.token}`])
      .send({
        name: 'New Test Project'
      })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})
