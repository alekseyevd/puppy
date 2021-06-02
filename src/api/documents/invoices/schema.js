module.exports = {
  type: 'document',
  properties: {
    inCharge: {
      type: 'ref',
      $ref: 'users'
    },
    sum: {type: 'number'},
    tax: {type: 'number'},
    sumWithTax: {type: 'number'},
    products: {
      type: 'array',
      items: {
        type: 'document',
        properties: {
          id: {
            type: 'ref',
            $ref: 'products'
          },
          desc: { type: 'string' },
          unit: {
            type: 'ref',
            $ref: 'units'
          },
          quantity: {type: 'number'},
          cost: {type: 'number'},
          taxRate: {type: 'number'},
          taxAmount: {type: 'number'},
          amount: {type: 'number'},
          amountWithTax: {type: 'number'},
          weight: {type: 'number'},
        }
      }
    }
  }
}
