module.exports = {
  type: 'document',
  properties: {
    name: {type: 'string'},
    category: {
      type: 'ref',
      $ref: 'categories'
    }
  }
}
