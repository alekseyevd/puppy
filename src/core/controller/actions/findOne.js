const createError = require('http-errors')

module.exports = async function findOne(req, res, next) {
  try {
    const Model = req.model

    const filter = { id: req.params.id } 
    if (req.permissions && req.permissions.own) {
      filter.user_id =  req.user.user_id
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
