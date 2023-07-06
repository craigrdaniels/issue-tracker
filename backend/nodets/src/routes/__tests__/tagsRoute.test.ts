import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'
import tagsRouter from '../tagsRoute.js'
import User from '../../models/userModel.js'
import Issue from '../../models/issueModel.js'
import Tag from '../../models/tagModel.js'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(tagsRouter)

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
  await Tag.replaceOne({}, testData.tag, {
    upsert: true
  })
})
afterEach(async () => {
  await dropCollections()
})

afterAll(async () => {
  await dropDB()
})

describe('Test tags router', () => {
  it('get all tags', async () => {
    const response = await request(app)
      .get('/tags')
      .set('Content-Type', 'application/json')
      .set('Cookie', `JWT=${testData.token}`)
    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(200)
  })

  it('get individual tag', async () => {
    const response = await request(app)
      .get('/tags/' + testData.tag._id)
      .set('Content-Type', 'application/json')
      .set('Cookie', `JWT=${testData.token}`)
    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(200)
  })

  it('create a new tag', async () => {
    const response = await request(app)
      .post('/tags')
      .set('Content-Type', 'application/json')
      .set('Cookie', `JWT=${testData.token}`)
      .send({
        tag: 'New Test Tag'
      })
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })

  it('edit a tag', async () => {
    const response = await request(app)
      .put('/tags/' + testData.tag._id)
      .set('Content-Type', 'application/json')
      .set('Cookie', `JWT=${testData.token}`)
      .send({
        color: '#FF0000'
      })
    expect(response.error).toBe(false)
    expect(response.statusCode).toBe(200)
  })

  it('delete a tag', async () => {
    const response = await request(app)
      .delete('/tags/' + testData.tag._id)
      .set('Content-Type', 'application/json')
      .set('Cookie', `JWT=${testData.token}`)
    expect(response.statusCode).toBe(200)
    expect(response.error).toBe(false)
  })
})
