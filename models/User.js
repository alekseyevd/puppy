const { Schema, model, Types } = require('mongoose')

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
    required: true,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  person: {
    type: Types.ObjectId,
    ref: 'Person',
    unique: true
  }
})

module.exports = model('User', schema)
