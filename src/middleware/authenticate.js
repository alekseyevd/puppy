const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const createError = require('http-errors')

module.exports = (req, res, next) => {
  const authHeaders = req.headers.authorization
  if (!authHeaders) {
    const user = {
      user_id: undefined,
      role: 'anonymous'
    }
    req.user = user
    return next()
  }
  // if (!authHeaders) throw createError(401, 'not authorized')

  const jwtoken = authHeaders.split(' ')[1] // "Bearer Token"
  if (!jwtoken) throw createError(401, 'not authorized')

  try {
    const user = jwt.verify(jwtoken, JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    throw createError(401, error.message)
  }
}
