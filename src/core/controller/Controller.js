const find = require('./actions/find')
const findOne = require('./actions/findOne')
const create = require('./actions/create')
const update = require('./actions/update')
const deleteOne = require('./actions/delete')
const print = require('./actions/print')
const email = require('./actions/email')

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne,
  print,
  email
}