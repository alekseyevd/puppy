const { Types } = require('mongoose')

module.exports = {
  login: {
    type: String,
    required: true,
    unique: true,
    fastSearch: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    fastSearch: true
  },
  phone: {
    type: String,
  },
  person: {
    type: Types.ObjectId,
    ref: 'people',
  },
  // role: {
  //   type: String,
  //   required: true,
  //   default: 'admin'
  // },
  role: {
    type: Types.ObjectId,
    // required: true,
    ref: 'roles',
    populate: true,
    autopopulate: { maxDepth: 1, select: 'name -_id' }
  }
}
