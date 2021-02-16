const request = require("supertest");
const app = require('../src/app')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { MONGO_URI, JWT_SECRET} = require('../src/config')

beforeEach(async() => {
  // return initializeCityDatabase();
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
});

afterEach(() => {
  mongoose.disconnect()
});

describe('Post to /auth/login', () => {
  test('should succesfully login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      login: 'user',
      password: '12345'
    })
    expect(res.statusCode).toBe(200)
    expect(typeof res.body.id).toBe('string')
    expect(typeof res.body.jwtoken).toBe('string')

    const refreshed = await request(app).post('/api/auth/refresh')
      .send({
        refreshToken: res.body.id
      })
      .set('authorization', `bearer ${res.body.jwtoken}`)
    expect(refreshed.statusCode).toBe(200)
    expect(typeof refreshed.body.id).toBe('string')
    expect(typeof refreshed.body.jwtoken).toBe('string')
  })

  test('403 response on invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      login: 'invalid',
      password: 'invalid'
    })
    expect(res.statusCode).toBe(403)
    expect(res.body.result).toBe(false)
  })

  test('401 response on expired token', async () => {
    const jwtoken = jwt.sign({ user: 1 }, JWT_SECRET, { expiresIn: '1ms'})
    const res = await request(app).get('/api/users')
      .set('authorization', `bearer ${jwtoken}`)

    expect(res.statusCode).toBe(401)
    expect(res.body.result).toBe(false)
  })

  
})
