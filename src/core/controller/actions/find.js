// const createError = require('http-errors')
const { PAGINATION_LIMIT } = require('../../../config')

module.exports = async function(req, res, next) {
  // todo beforeFind
  if (this.beforeFind) this.beforeFind()

  try {
    const Model = this.model

    // if (req.query.filter && !isJsonValid(req.query.filter))
    //   throw createError(400, 'query param \'filter\' is not valid json string.')

    const search = { ...req.query }
    search.status = req.query.status || 1

    delete search.limit
    delete search.page

    // Object.keys(search).forEach(key => {
    //   if (key !== 'status') {
    //     search[key] = { $regex: '.*' + search[key] + '.*', $options: 'i' }
    //   }
    // })

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

    const entities = await Model.search(search)
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
    })
  } catch (error) {
    return next(error)
  }
  // to-do afterfind()
}
