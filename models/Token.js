const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  id: {type: String},
  expired: {type: Number},
  token: {type: String}
})

module.exports = model('Token', schema)