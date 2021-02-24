const find = require('./actions/find')
const findOne = require('./actions/findOne')
const create = require('./actions/create')
const update = require('./actions/update')
const deleteOne = require('./actions/delete')

// to-do delete many

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne,
}
