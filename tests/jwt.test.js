const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { MONGO_URI, JWT_ACC_EXPIRED} = require('../src/config')
const { issueTokens } = require('../src/services/authService')

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
})

describe('check issueTokens', () => {

  test('shoud issue tokens', async () => {
    const { jwtoken } = await issueTokens({ data: 'test'})

    const {exp} = jwt.decode(jwtoken)

    const result = exp - Date.now()

    expect(result <= JWT_ACC_EXPIRED).toBe(true)
  })

})