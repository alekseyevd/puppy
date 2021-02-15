const { Schema, model, Types } = require('mongoose')

const schema = new Schema({
  fullname: {type: String},
  name: {type: String},
  surname: {type: String},
  patronymic: {type: String},
  gender: {type: String},
  birthdate: {type: Date},
  emails: [String],
  phones: [String],
  user: {
    type: Types.ObjectId,
    ref: 'User'
  }
})

module.exports = model('Person', schema)
