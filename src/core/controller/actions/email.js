const createError = require('http-errors')

module.exports = async function (req, res, next) {
  try {
    const Model = req.model
    if (!Model) throw createError(404, 'not found')

  } catch (error) {
    next(error)
  }
}
