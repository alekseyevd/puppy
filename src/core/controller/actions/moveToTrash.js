const createError = require('http-errors')

module.exports = async function moveToTrash(req, res, next) {
  try {
    const Model = this.model

    const ids = req.body
    if (!Array.isArray(ids) || ids.length === 0) throw createError(400, 'not found')

    const result = ids.length === 1
      ? await Model.updateOne({ id: ids[0]}, { status: 3 })
      : await Model.updateMany({
        id: { $in: ids }
      }, { status: 3 })

    res.json({
      result: true
    })
  } catch (error) {
    return next(error)
  }
}
