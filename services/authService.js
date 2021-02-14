const { v4: uuid } = require('uuid');
const jwtoken = require('jsonwebtoken')
const { JWT_SECRET, JWT_ACC_EXPIRED, JWT_REF_EXPIRED } = require('../config')
const RefreshToken = require('../models/Token')

async function issueTokens(data) {
  const token = jwtoken.sign(data, JWT_SECRET, { expiresIn: JWT_ACC_EXPIRED})

  const refreshToken = uuid()
  const refresh = new RefreshToken({
    id: refreshToken,
    expired: Date.now() + JWT_REF_EXPIRED,
    token
  })

  await refresh.save()

  return {
    token,
    refreshToken
  }
}

async function refreshToken(id, token) {
  const refresh = RefreshToken.findOne({ id, token })
  if (!refresh || refresh.expired > Date.now()) return false // to-do - throw error

  await RefreshToken.deleteOne({ id })

  const data = jwt.decode(token)
  const tokens = await issueTokens(data)
  return tokens
}

async function removeToken(id) {
  const result = await RefreshToken.deleteOne({ id })
  if (!result.deletedCount) return false //to-do throw error

  // to-do add token to blacklist in redis
  return true
}

module.exports = {
  issueTokens,
  refreshToken,
  removeToken
}