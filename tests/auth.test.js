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

  //toDo issue long token and save to db
});

afterEach(() => {
  mongoose.disconnect()
});

describe('Post to /api/auth/login', () => {

  test('should succesfully login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      login: 'user',
      password: '12345'
    })
    expect(res.statusCode).toBe(200)
    expect(typeof res.body.id).toBe('string')
    expect(typeof res.body.jwtoken).toBe('string')
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

describe('Post to /api/auth/refresh', () => {

  test('user can get new jwtoken using reftesh id', async () => {
    const res = await request(app).post('/api/auth/login').send({
      login: 'user',
      password: '12345'
    })
    const refreshed = await request(app).post('/api/auth/refresh')
        .send({
          refreshToken: res.body.id
        })
        .set('authorization', `bearer ${res.body.jwtoken}`)
    expect(refreshed.statusCode).toBe(200)
    expect(typeof refreshed.body.id).toBe('string')
    expect(typeof refreshed.body.jwtoken).toBe('string')
  })

  test('401 error on invalid refresh token', async () => {
    const refreshed = await request(app).post('/api/auth/refresh')
        .send({
          refreshToken: 'INVALID'
        })
        .set('authorization', `bearer INVALID`)
    expect(refreshed.statusCode).toBe(401)
    expect(refreshed.body.result).toBe(false)
  })

  test('User can use refresh token only once', async () => {
    const res = await request(app).post('/api/auth/login').send({
      login: 'user',
      password: '12345'
    })
    const refreshed = await request(app).post('/api/auth/refresh')
        .send({
          refreshToken: res.body.id
        })
        .set('authorization', `bearer ${res.body.jwtoken}`)
    expect(refreshed.statusCode).toBe(200)
    expect(refreshed.body.result).toBe(true)

    const refreshed2 = await request(app).post('/api/auth/refresh')
        .send({
          refreshToken: res.body.id
        })
        .set('authorization', `bearer ${res.body.jwtoken}`)
    expect(refreshed2.statusCode).toBe(401)
    expect(refreshed2.body.result).toBe(false)
  })

  test('Multiple refresh tokens are valid', async () => {
    const res1 = await request(app).post('/api/auth/login').send({
      login: 'user',
      password: '12345'
    })
    const res2 = await request(app).post('/api/auth/login').send({
      login: 'user',
      password: '12345'
    })
    const refreshed1 = await request(app).post('/api/auth/refresh')
        .send({
          refreshToken: res1.body.id
        })
        .set('authorization', `bearer ${res1.body.jwtoken}`)
    const refreshed2 = await request(app).post('/api/auth/refresh')
        .send({
          refreshToken: res2.body.id
        })
        .set('authorization', `bearer ${res2.body.jwtoken}`)

    expect(refreshed1.statusCode).toBe(200)
    expect(refreshed1.body.result).toBe(true)
    expect(refreshed2.statusCode).toBe(200)
    expect(refreshed2.body.result).toBe(true)
  })
})

describe('Post to /api/auth/logout', () => {
  
  test('Refresh token becomes invalid on logout', async () => {
    const login = await request(app).post('/api/auth/login').send({
      login: 'user',
      password: '12345'
    })

    const logout = await request(app).post('/api/auth/logout').send({
      refreshToken: login.body.id
    })
    expect(logout.statusCode).toBe(200)
    expect(logout.body.result).toBe(true)

    const refreshed = await request(app).post('/api/auth/refresh')
        .send({
          refreshToken: login.body.id
        })
        .set('authorization', `bearer ${login.body.jwtoken}`)
    expect(refreshed.statusCode).toBe(401)
    expect(refreshed.body.result).toBe(false)
  })
})

