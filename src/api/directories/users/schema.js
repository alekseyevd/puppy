const { Types } = require('mongoose')

module.exports = {
  type: 'document',
  properties: {
    login: {
      type: 'string',
      required: true,
      unique: true,
      fastSearch: true
    },
    password: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      index: true,
      fastSearch: true
    },
    phone: {
      type: 'string',
    },
    person: {
      type: 'ref',
      $ref: 'people',
    },
    role: {
      type: 'ref',
      required: true,
      $ref: 'roles',
      autopopulate: { maxDepth: 1 }
    }
  }
}
