const createError = require('http-errors')

module.exports = async function deleteOne(req, res, next) {
  try {
    const enitity = req.params.dir
    const Model = require('../Model')(enitity)
    if (!Model) throw createError(404, 'not found')

    const filter = { id: req.params.id }

    if (req.permissions && req.permissions.own) {
      filter.user_id =  req.user.user_id
    }

    const result = await Model.updateOne(filter, { status: 3 })

    if (result.n === 0) throw createError(404, 'not found')

    if (result.nModified  === 0) {
      await Model.deleteOne(filter)
    }

    res.json({
      result: true
    })
  } catch (error) {
    return next(error)
  }
}