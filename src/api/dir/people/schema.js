const { Types } = require('mongoose')

module.exports = {
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
}