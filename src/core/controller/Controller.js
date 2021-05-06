const find = require('./actions/find')
const findOne = require('./actions/findOne')
const create = require('./actions/create')
const update = require('./actions/update')
const moveToTrash = require('./actions/moveToTrash')
const deleteOne = require('./actions/delete')
const print = require('./actions/print')
const email = require('./actions/email')
const Puppy = require('../Puppy')

// module.exports = {
//   find,
//   findOne,
//   create,
//   update,
//   deleteOne,
//   print,
//   email
// }

class Controller {
  constructor(params = {}, entity = null) {
    if (entity) {
      this.model = Puppy.models[entity]
      this.templates = Puppy.templates[entity]

      this.find = find.bind(this)
      this.findOne = findOne.bind(this)
      this.create = create.bind(this)
      this.update = update.bind(this)
      this.moveToTrash = moveToTrash.bind(this)
      this.deleteOne = deleteOne.bind(this)
      this.print = print.bind(this)
      this.email = email.bind(this)
    }

    Object.keys(params).forEach(key => {
      this[key] = params[key].bind(this)
    })
  }
}

module.exports = Controller
