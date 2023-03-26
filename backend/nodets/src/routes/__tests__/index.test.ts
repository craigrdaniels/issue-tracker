import request from 'supertest'

const baseUrl = 'http://localhost:3000'

describe('GET /', () => {
  it('should return 200', async () => {
    const response = await request(baseUrl)
      .get('/')
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200)
    // expect(response.headers['Content-Type']).toMatch(/json/)
    expect(response.error).toBe(false)
  })
})

// Commented out sections do not work until push functions added
