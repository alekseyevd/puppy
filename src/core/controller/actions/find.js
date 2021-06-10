// const createError = require('http-errors')
const { PAGINATION_LIMIT } = require('../../../config')

module.exports = async function(req, res, next) {
  // todo beforeFind
  if (this.beforeFind) this.beforeFind()

  try {
    const Model = this.model
    const role = req.user.role

    // to-do validate req.query with schema

    const selection = this.handleSelectionByRole(role)
    const filter = this.handleFilterFromRequest(req)

    const count = await Model.countDocuments(filter)
    const limit = Math.abs(Number.parseInt(req.query.limit) || PAGINATION_LIMIT)
    let page = Math.abs(Number.parseInt(req.query.page) || 0)

    let skip = page * limit
    if (skip >= count) {
      page = Math.floor(count / (limit + 1))
      skip = page * limit
    }

    const entities = await Model.search(filter)
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
