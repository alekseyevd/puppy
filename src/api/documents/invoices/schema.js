const { Types } = require('mongoose')

module.exports = {
  inCharge: {
    type: Types.ObjectId,
    ref: 'User'
  },
  sum: Number,
  tax: Number,
  sumWithTax: Number,
  products: [
    {
      id: {
        type: Types.ObjectId,
        ref: 'products'
      },
      desc: String,
      unit: {
        type: Types.ObjectId,
        ref: 'units'
      },
      quantity: Number,
      cost: Number,
      taxRate: Number,
      taxAmount: Number,
      amount: Number,
      amountWithTax: Number,
      weight: Number
    }
  ]
}
