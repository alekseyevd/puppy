module.exports = {
  type: 'document',
  properties: {
    name: {type: 'string', fastSearch: true, filter: true},
    surname: {type: 'string', fastSearch: true, filter: true},
    patronymic: {type: 'string', fastSearch: true, filter: true},
    gender: {type: 'string'},
    birthdate: {type: 'date'},
    emails: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    phones: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    address: {type: 'string'},
    passport: {
      type: 'document',
      properties: {
        number: {type: 'string'},
        issuedDate: {type: 'date'},
        issuedBy: {type: 'string'},
      }
    },
    work_in: {
      type: 'ref',
      $ref: 'companies',
      populate: true
    }
  }
}
