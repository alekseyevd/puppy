const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const createError = require('http-errors')

module.exports = (req, res, next) => {
  const auth_headers = req.headers.authorization
  if (!auth_headers) throw createError(401, 'not authorized')

  const jwtoken = auth_headers.split(' ')[1] // "Bearer Token"
  if (!jwtoken) throw createError(401, 'not authorized')

  try {
    const user = jwt.verify(jwtoken, JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    throw createError(401, error.message)
  }
}
