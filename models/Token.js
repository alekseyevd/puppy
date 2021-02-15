const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid');

const schema = new Schema({
  uuid: {type: String, default: uuid},
  expired: {type: Number},
  token: {type: String}
})

module.exports = model('Token', schema)