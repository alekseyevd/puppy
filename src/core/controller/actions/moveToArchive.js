const createError = require('http-errors')

module.exports = async function moveToArchive(req, res, next) {
  try {
    const Model = this.model

    const ids = req.body
    if (!Array.isArray(ids) || ids.length === 0) throw createError(400, 'not found')

    const result = ids.length === 1
      ? await Model.updateOne({ id: ids[0]}, { status: 2 })
      : await Model.updateMany({
        id: { $in: ids }
      }, { status: 2 })

    res.json({
      result: true
    })
  } catch (error) {
    return next(error)
  }
}
