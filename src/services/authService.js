const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_ACC_EXPIRED, JWT_REF_EXPIRED } = require('../config')
const Token = require('../models/Token')

async function issueTokens(data) {
  const jwtoken = jwt.sign(data, JWT_SECRET, { expiresIn: JWT_ACC_EXPIRED})

  const token = new Token({
    expiredAt: Date.now() + JWT_REF_EXPIRED,
    jwtoken
  })

  const result = await token.save()
  const id = result.id

  return {
    id,
    jwtoken
  }
}

async function refreshToken(id, jwtoken) {
  const token = Token.findOne({ id, jwtoken })
  if (!token || token.expiredAt > Date.now()) return false // to-do - throw error

  await Token.deleteOne({ id })

  const data = jwt.decode(jwtoken)
  const tokens = await issueTokens(data)
  return tokens
}

async function removeToken(id) {
  const result = await Token.deleteOne({ id })
  if (!result.deletedCount) return false //to-do throw error

  // to-do add token to blacklist in redis
  return true
}

module.exports = {
  issueTokens,
  refreshToken,
  removeToken
}