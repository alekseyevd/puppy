/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { Schema, model, Types } = require('mongoose')
const toMomgooseSchema = require('../src/core/functions/toMongooseSchema')

const schema = {
  type: 'document',
  properties: {
    inCharge: {
      type: 'ref',
      $ref: 'users'
    },
    str: {type: 'string', fastSearch: true},
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

const mongooseSchema = toMomgooseSchema(schema)
const sch = new Schema(mongooseSchema)
console.log(sch)
