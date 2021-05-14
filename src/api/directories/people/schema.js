const { Types } = require('mongoose')

module.exports = {
  name: {type: String, fastSearch: true},
  surname: {type: String, fastSearch: true},
  patronymic: {type: String, fastSearch: true},
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
    ref: 'Company',
    populate: true
  }
}
