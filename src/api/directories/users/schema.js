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
    ref: 'People',
  },
  role: {
    type: String,
    required: true,
    default: 'admin'
  },
}
