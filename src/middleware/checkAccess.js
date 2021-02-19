const permissions = require('../config/permissions')
const createError = require('http-errors')
const model = require('../models/Model')

module.exports = (action) => (req, res, next) => {
  const role = req.user.role
  const entities = req.params.dir

  const Model = model(entities)
  if (!Model) throw createError(404, 'not found')  

  if (!permissions[role][entities]) throw createError(403, 'Forbidden')

  if (!permissions[role][entities][action]) throw createError(403, 'Forbidden ')

  if (typeof permissions[role][entities][action] === 'object') {
    req.permissions = permissions[role][entities][action]
  }

  req.model = Model
  next()
}