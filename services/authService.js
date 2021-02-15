const jwtoken = require('jsonwebtoken')
const { JWT_SECRET, JWT_ACC_EXPIRED, JWT_REF_EXPIRED } = require('../config')
const RefreshToken = require('../models/Token')

async function issueTokens(data) {
  const token = jwtoken.sign(data, JWT_SECRET, { expiresIn: JWT_ACC_EXPIRED})

  const refresh = new RefreshToken({
    expired: Date.now() + JWT_REF_EXPIRED,
    token
  })

  const result = await refresh.save()

  return {
    token,
    refreshToken: result.uuid
  }
}

async function refreshToken(uuid, token) {
  const refresh = RefreshToken.findOne({ uuid, token })
  if (!refresh || refresh.expired > Date.now()) return false // to-do - throw error

  await RefreshToken.deleteOne({ uuid })

  const data = jwt.decode(token)
  const tokens = await issueTokens(data)
  return tokens
}

async function removeToken(uuid) {
  const result = await RefreshToken.deleteOne({ uuid })
  if (!result.deletedCount) return false //to-do throw error

  // to-do add token to blacklist in redis
  return true
}

module.exports = {
  issueTokens,
  refreshToken,
  removeToken
}