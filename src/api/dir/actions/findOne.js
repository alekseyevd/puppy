const createError = require('http-errors')

module.exports = async function findOne(req, res, next) {
  try {
    const enitity = req.params.dir
    const Model = require('../Model')(enitity)
    if (!Model) throw createError(404, 'not found')

    const filter = { id: req.params.id } 
    if (req.permissions && req.permissions.own) {
      filter.owner = req.user.user
    }

    let selection = []
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      selection = req.permissions.fields
    }

    const result = await Model.findOne(filter).select(selection)

    if (!result) throw createError(404, 'not found')

    res.json({
      result: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}
