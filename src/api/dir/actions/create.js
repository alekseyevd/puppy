const createError = require('http-errors')

module.exports = async function create(req, res, next) {
  try {
    const enitity = req.params.dir
    const Model = require('../Model')(enitity)
    if (!Model) throw createError(404, 'not found')
  
    // to do validate fields and create new entity
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      const selection = req.permissions.fields
      const postFields = Object.keys(req.body)
      const disallowed = postFields.filter(field => !selection.includes(field))
      if (disallowed.length > 0)
        throw createError(403, `Fields '${disallowed.join(', ')}' are forbidden to be added for current role.`)
    }

    const entity = new Model(req.body)
    await entity.save()

    res.join({
      result: true,
      data: entity
    })
  } catch (error) {
    return next(error)
  }
}