const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid');

const schema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  person: {
    type: Types.ObjectId,
    ref: 'Person',
  }
})

module.exports = model('User', schema)
