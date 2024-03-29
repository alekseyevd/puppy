const createError = require('http-errors')

module.exports = async function deleteOne(req, res, next) {
  try {
    const Model = this.model

    const filter = { id: req.params.id }

    if (req.permissions && req.permissions.own) {
      filter.user_id = req.user.user_id
    }

    const result = await Model.updateOne(filter, { status: 3 })

    if (result.n === 0) throw createError(404, 'not found')

    if (result.nModified === 0) {
      await Model.deleteOne(filter)
    }

    res.json({
      result: true
    })
    res.json({
      result: req.body
    })
  } catch (error) {
    return next(error)
  }
}
