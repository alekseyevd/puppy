const request = require("supertest");
const app = require('../src/app')
const mongoose = require('mongoose')
const { MONGO_URI } = require('../src/config')

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
})
