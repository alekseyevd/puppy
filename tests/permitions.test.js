const request = require("supertest")
const app = require('../src/app')
const mongoose = require('mongoose')

beforeEach(async() => {
  // return initializeCityDatabase();
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
})

afterEach(() => {
  mongoose.disconnect()
})

describe('Checking permittions', () => {

})