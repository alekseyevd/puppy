const { Types } = require('mongoose')

module.exports = {
  company: {
    type: Types.ObjectId,
    ref: 'companies'
  },
  prefix: String,
  tax: String,
  signs: String,
  logo: String
}
