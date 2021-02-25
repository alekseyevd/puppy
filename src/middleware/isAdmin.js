const createHttpError = require("http-errors")

module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') throw createHttpError(403, 'forbidden')

  next()
}