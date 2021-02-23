const createError = require('http-errors')

module.exports = async function create(req, res, next) {
  try {
    const enitity = req.params.dir
    const Model = require('../Model')(enitity)
    if (!Model) throw createError(404, 'not found')
  
    // to do validate fields and create new entity
  
    const entity = new Model(req.body)
    await entity.save()

    return {
      result: true,
      data: entity
    }
  } catch (error) {
    return next(error)
  }
}