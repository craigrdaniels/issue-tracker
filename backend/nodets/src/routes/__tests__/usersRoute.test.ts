import request from 'supertest'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import * as testData from '../../db/testData.js'

beforeAll(async () => {
  await connectDB()
})
afterEach(async () => {
  await dropCollections()
})
afterAll(async () => {
  await dropDB()
})

const baseUrl = 'http://localhost:3000'

describe('User Functions', () => {
  it('create new user', async () => {
    const response = await request(baseUrl)
      .post('/users/signup')
      .send({
        email: testData.user.email,
        username: testData.user.username,
        password: testData.user.password
      })
      .set('Accept', 'application/json')
    // console.log(response)
    expect(response.statusCode).toBe(200)
  })
})
