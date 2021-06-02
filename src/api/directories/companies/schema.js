module.exports = {
  type: 'document',
  properties: {
    name: {type: 'string'},
    full_name: {type: 'string'},
    short_name: {type: 'string'},
    type: {type: 'string'},
    inn: {type: 'number'},
    kpp: {type: 'number'},
    ogrn: {type: 'number'},
    ogrn_date: {type: 'date'},
    management: {
      type: 'document',
      properties: {
        name: {type: 'string'},
        post: {type: 'string'}
      }
    },
    address: {type: 'string'},
    bank: {
      type: 'document',
      properties: {
        name: {type: 'string'},
        account: {type: 'number'},
        kor: {type: 'number'},
        bik: {type: 'number'}
      }
    }
  }
}
