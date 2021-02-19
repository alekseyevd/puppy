const { Router } = require('express')
const checkAccess = require('../../middleware/checkAccess')
const authorize = require('../../middleware/authorize')
const createError = require('http-errors')
const router = Router()
//const model = require('../../models/Model')

function isJsonValid(str) {
  try {
    JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

router.get('/:dir', authorize, checkAccess('find'), async (req, res, next) => {
  try {
    if (req.query.filter && !isJsonValid(req.query.filter))
      throw createError(400, 'query param \'filter\' is not valid json string.')

    const filter = req.query.filter
        ? JSON.parse(req.query.filter)
        : {}

    if (req.permissions && req.permissions.own) {
      filter.owner =  req.user.id
    }

    let selection = []
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      selection = req.permissions.fields
    }

    //to-do paginanion

    const Model = req.model
    const count = await Model.countDocuments()
    const entities = await Model.find(filter)
      .select(selection)
      .skip(0)
      .limit(20)
    res.header({
      'Pagination-Count': count,
    })
    res.json({
      result: true,
      [req.params.dir]: entities,
      count
    })
  } catch (error) {
    return next(error)
  }
})

module.exports = router
