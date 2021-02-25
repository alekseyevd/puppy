const createError = require('http-errors')
const { PAGINATION_LIMIT } = require('../../../config')

function isJsonValid(str) {
  try {
    JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

module.exports = async function find(req, res, next) {
  //todo beforeFind
  try {
    const enitity = req.params.dir
    const Model = this.model
    if (!Model) throw createError(404, 'not found')

    if (req.query.filter && !isJsonValid(req.query.filter))
      throw createError(400, 'query param \'filter\' is not valid json string.')

    const filter = req.query.filter
        ? JSON.parse(req.query.filter)
        : {}

    if (req.permissions && req.permissions.own) {
      filter.user_id =  req.user.user_id
    }

    let selection = []
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      selection = req.permissions.fields
    }

    const count = await Model.countDocuments(filter)
    const limit = Math.abs(Number.parseInt(req.query.limit) || PAGINATION_LIMIT)
    let page = Math.abs(Number.parseInt(req.query.page) || 0)

    let skip = page * limit
    if (skip >= count) {
      page = Math.floor(count / (limit + 1))
      skip = page * limit
      console.log(page);
    }
  
    const entities = await Model.find(filter)
      .select(selection)
      .skip(skip)
      .limit(limit)

    count && res.header({
      'Pagination-Count': count,
      'Pagination-Limit': limit,
      'Pagination-Page': page,
      'Content-Range': `${enitity} ${skip}-${skip + count - 1}/${count}`
    })
    
    res.json({
      result: true,
      data: entities,
      count
    })
  } catch (error) {
    return next(error)
  }
  //to-do afterfind()
}
