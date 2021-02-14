const jwtoken = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

module.exports = (req, res, next) => {
  try {
    const auth_headers = req.headers.authorization
    if (!auth_headers) throw Error('not authenticated')

    const token = auth_headers.split(' ')[1] // "Bearer Token"
    if (!token) throw Error('not authenticated')

    const user = jwtoken.verify(token, JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ result: false, message: error.message})
  }
}
