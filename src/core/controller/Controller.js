const find = require('./actions/find')
const findOne = require('./actions/findOne')
const create = require('./actions/create')
const update = require('./actions/update')
const moveToTrash = require('./actions/moveToTrash')
const deleteOne = require('./actions/delete')
const print = require('./actions/print')
const email = require('./actions/email')
const Puppy = require('../Puppy')
const moveTo = require('./actions/moveTo')

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
      this.schema = Puppy.schemas[entity]

      this.find = find.bind(this)
      this.findOne = findOne.bind(this)
      this.create = create.bind(this)
      this.update = update.bind(this)
      this.moveToTrash = moveToTrash.bind(this)
      this.moveTo = moveTo.bind(this)
      this.deleteOne = deleteOne.bind(this)
      this.print = print.bind(this)
      this.email = email.bind(this)
    }

    Object.keys(params).forEach(key => {
      this[key] = params[key].bind(this)
    })
  }

  handleSelectionByRole(role) {
    return typeof this.schema.permissions[role].find === 'object'
      ? this.schema.permissions[role].find.fields
      : []
  }

  handleFilterFromRequest(req) {
    // to-do validate req.query with schema
    const role = req.user.role

    const search = Object.keys(this.schema.properties)
        .filter(field => this.schema.properties[field].filter && req.query[field])
        .reduce((acc, field) => {
          acc[field] = req.query[field]
          return acc
        }, {})

    search.status = req.query.status || 1

    if (this.schema.permissions[role].find === 'object' && this.schema.permissions[role].find.own) {
      search.user_id = req.user.user_id
    }
    return search
  }
}

module.exports = Controller
