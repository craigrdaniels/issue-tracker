import request from 'supertest'
import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { connectDB, dropCollections, dropDB } from '../../db/testdb.js'
import User from '../../models/userModel.js'
import RefreshToken from '../../models/refreshTokenModel.js'

dotenv.config({ path: '.env.development' })

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

describe('GET /', () => {
  console.log(process.env.JWT_SECRET_KEY)
  const token = jsonwebtoken.sign(
    { email: 'testuser@email.com' },
    // eslint-disable-next-line
    process.env.JWT_SECRET_KEY!
  )
  const testUser = new User({
    email: 'testuser@email.com',
    password: 'password',
    username: 'testuser'
  })
  const testToken = new RefreshToken({
    email: 'testuser@email.com',
    token
  })

  beforeAll(async () => {
    try {
      await testUser.save()
      await testToken.save()
    } catch (err) {
      console.log(err)
    }
  })
  it('should return 200', async () => {
    const response = await request(baseUrl)
      .get('/issues')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
    console.log(response)
    expect(response.statusCode).toBe(200)
    // expect(response.headers['Content-Type']).toMatch(/json/)
    expect(response.error).toBe(false)
  })
  it('should return issues', async () => {
    // const response = await request(baseUrl).get('/')
    // console.log(response)
    // expect(response.body.data.length).toBeGreaterThanOrEqual(1)
  })
})

// Commented out sections do not work until push functions added
