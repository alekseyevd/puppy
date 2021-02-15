const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid')

const schema = new Schema({
  uuid: {
    type: String,
    default: uuid,
    unique: true
  }, 
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
