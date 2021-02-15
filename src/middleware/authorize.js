const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

module.exports = (req, res, next) => {
  try {
    const auth_headers = req.headers.authorization
    if (!auth_headers) throw Error('not authenticated')

    const jwtoken = auth_headers.split(' ')[1] // "Bearer Token"
    if (!jwtoken) throw Error('not authenticated')

    const user = jwt.verify(jwtoken, JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ result: false, message: error.message})
  }
}
