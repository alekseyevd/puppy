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

module.exports = async function (req, res, next) {
  // todo beforeFind
  if (this.beforeFind) this.beforeFind()

  try {
    const Model = this.model

    // if (req.query.filter && !isJsonValid(req.query.filter))
    //   throw createError(400, 'query param \'filter\' is not valid json string.')

    const search = { ...req.query }

    delete search.limit
    delete search.page

    Object.keys(search).forEach(key => {
      search[key] = { $regex: '.*' + search[key] + '.*', $options: 'i' }
    })

    // return res.json(req.query)

    // const filter = req.query.filter
    //     ? JSON.parse(req.query.filter)
    //     : {}

    if (req.permissions && req.permissions.own) {
      search.user_id = req.user.user_id
    }

    let selection = []
    if (req.permissions && req.permissions.fields && Array.isArray(req.permissions.fields)) {
      selection = req.permissions.fields
    }

    const count = await Model.countDocuments(search)
    const limit = Math.abs(Number.parseInt(req.query.limit) || PAGINATION_LIMIT)
    let page = Math.abs(Number.parseInt(req.query.page) || 0)

    let skip = page * limit
    if (skip >= count) {
      page = Math.floor(count / (limit + 1))
      skip = page * limit
    }

    const entities = await Model.find(search)
        .select(selection)
        .skip(skip)
        .limit(limit)

    count && res.header({
      'Pagination-Count': count,
      'Pagination-Limit': limit,
      'Pagination-Page': page,
      'Content-Range': `${skip}-${skip + count - 1}/${count}`
    })

    res.json({
      result: true,
      data: entities,
      count
    })
  } catch (error) {
    return next(error)
  }
  // to-do afterfind()
}
