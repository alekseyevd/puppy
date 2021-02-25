const find = require('./actions/find')
const findOne = require('./actions/findOne')
const create = require('./actions/create')
const update = require('./actions/update')
const deleteOne = require('./actions/delete')

class Controller {
  constructor(params) {
    this.model = params.model
  }

  find = find.bind(this)
  findOne = findOne.bind(this)
  create = create.bind(this)
  update = update.bind(this)
  deleteOne = deleteOne.bind(this)

}

module.exports = Controller