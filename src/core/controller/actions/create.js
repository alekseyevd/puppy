const createError = require('http-errors')

module.exports = async function create(req, res, next) {
  try {
    const Model = this.model

    // to do validate fields
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      const selection = req.permissions.fields
      const postFields = Object.keys(req.body)
      const disallowed = postFields.filter(field => !selection.includes(field))
      if (disallowed.length > 0)
        throw createError(403, `Fields '${disallowed.join(', ')}' are forbidden to be added for current role.`)
    }

    // to-do add owner
    const user_id = req.user.user_id
    const body = { ...req.body, addedBy: user_id }

    const entity = new Model(body)
    await entity.save()

    res.status(201).json({
      result: true,
      data: entity
    })
  } catch (error) {
    return next(error)
  }
}
