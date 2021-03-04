const { Types } = require('mongoose')

module.exports = {
  name: {type: String},
  category: {
    type: Types.ObjectId,
    ref: 'categories'
  }
}