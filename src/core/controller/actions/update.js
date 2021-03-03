const createError = require('http-errors')

module.exports = async function update(req, res, next) {
  try {
    const Model = req.model

    const filter = { id: req.params.id }
  
    // to do validate fields and create new entity
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      const selection = req.permissions.fields
      const postFields = Object.keys(req.body)
      const disallowed = postFields.filter(field => !selection.includes(field))
      if (disallowed.length > 0)
        throw createError(403, `Fields '${disallowed.join(', ')}' are forbidden to be updated for current role.`)
    }

    if (req.permissions && req.permissions.own) {
      filter.user_id =  req.user.user_id
    }

    const result = await Model.updateOne(filter, req.body)

    if (result.n === 0) throw createError(404, 'not found')

    // to-do what to return if id was found but not updated

    res.json({
      result: true
    })
  } catch (error) {
    return next(error)
  }
}