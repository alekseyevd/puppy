const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid');

const schema = new Schema({
  id: {type: String, default: uuid},
  expiredAt: {type: Number},
  jwtoken: {type: String}
})

module.exports = model('Token', schema)