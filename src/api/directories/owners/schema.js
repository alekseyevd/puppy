module.exports = {
  type: 'document',
  properties: {
    company: {
      type: 'ref',
      $ref: 'companies'
    },
    prefix: {type: 'string'},
    tax: {type: 'string'},
    signs: {type: 'string'},
    logo: {type: 'string'},
  }
}
