const { Schema, model, Types } = require('mongoose')
const { v4: uuid } = require('uuid')

const schema = new Schema({
  id: {
    type: String,
    default: uuid,
    unique: true
  },
  status: {
    type: Number,
    default: 1
  },
  user_id: {
    type: Types.ObjectId,
    ref: 'User'
  },
  fullname: {type: String},
  name: {type: String},
  surname: {type: String},
  patronymic: {type: String},
  gender: {type: String},
  birthdate: {type: Date},
  emails: [String],
  phones: [String],
  address: {type: String},
  passport: {
    number: {type: String},
    issuedDate: {type: Date},
    issuedBy: {type: String},
  },
  work_in: {
    type: Types.ObjectId,
    ref: 'Company'
  }
}, {
  timestamps: true
})

module.exports = model('Person', schema)
