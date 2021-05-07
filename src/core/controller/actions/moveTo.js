const createError = require('http-errors')
const status = {
  active: 1,
  archive: 2,
  trash: 3
}

module.exports = async function moveToArchive(req, res, next) {
  try {
    const Model = this.model

    const ids = req.body
    if (!Array.isArray(ids) || ids.length === 0) throw createError(400, 'invalid params')

    const { where } = req.params
    if (!status[where]) throw createError(400, 'invalid params')

    const result = ids.length === 1
      ? await Model.updateOne({ id: ids[0]}, { status: status[where] })
      : await Model.updateMany({
        id: { $in: ids }
      }, { status: status[where] })

    res.json({
      result: true
    })
  } catch (error) {
    return next(error)
  }
}
