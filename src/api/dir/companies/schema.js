module.exports = {
  name: {type: String},
  full_name: {type: String},
  short_name: {type: String},
  type: {type: String},
  inn: {type: Number},
  kpp: {type: Number},
  ogrn: {type: Number},
  ogrn_date: {type: Date},
  management: {
    name: {type: String},
    post: {type: String}
  },
  address: {type: String},
  bank: {
    name: {type: String},
    account: {type: Number},
    kor: {type: Number},
    bik: {type: Number}
  }}