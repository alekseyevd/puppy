const permissions = require('../config/permissions')
const createError = require('http-errors')

module.exports = (handler) => (req, res, next) => {
  const role = req.user.role
  const [ entities, action ] = handler.split('.')


  if (!permissions[role][entities]) throw createError(403, 'Forbidden')

  if (!permissions[role][entities][action]) throw createError(403, 'Forbidden')

  if (typeof permissions[role][entities][action] === 'object') {
    req.permissions = permissions[role][entities][action]
  }

  next()
}