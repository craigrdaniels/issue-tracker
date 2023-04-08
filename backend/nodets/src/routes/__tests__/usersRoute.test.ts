import 'jest/'
import request from 'supertest'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'

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
  let session = null
  const newUser = {
    email: 'test@user.com',
    password: 'testpass123'
  }

  it('create new user', async () => {
    const response = await request(baseUrl)
      .post('/users/signup')
      .send(newUser)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)

    session = response.body.token
    console.log(session)
  })
})
