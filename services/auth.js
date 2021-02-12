const { v4: uuid } = require('uuid');
const jwtoken = require('jsonwebtoken')
const { JWT_SECRET, JWT_ACC_EXPIRED, JWT_REF_EXPIRED } = require('../config')

async function issueTokens(userId) {
  const token = jwtoken.sign({ id: userId}, JWT_SECRET, { expiresIn: JWT_ACC_EXPIRED})

  //to-do: add refresh token to db/redis
  const refresh = {
    id: uuid(),
    expired: Date.now() + JWT_REF_EXPIRED
  }

  return {
    token,
    refresh
  }
}

module.exports = {
  issueTokens
}