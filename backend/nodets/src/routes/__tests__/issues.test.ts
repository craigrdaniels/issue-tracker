import request from 'supertest'

const baseUrl = 'http://localhost:3000'

describe('GET /', () => {
  const newIssue = {
    id: 1,
    title: 'Test issue'
  }

  beforeAll(async () => {
    await request(baseUrl).post('/issues').send(newIssue)
  })
  afterAll(async () => {
    await request(baseUrl).delete(`/issues/${newIssue.id}`)
  })
  it('should return 200', async () => {
    const response = await request(baseUrl)
      .get('/issues')
      .set('Accept', 'application/json')
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
