/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { Schema, model, Types } = require('mongoose')

const schema = {
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

function toMomgooseSchema(schema) {
  let field
  const { type } = schema
  switch (type) {
    case 'document':
      field = Object.keys(schema.properties).reduce((res, prop) => {
        res[prop] = toMomgooseSchema(schema.properties[prop])
        return res
      }, {})
      break

    case 'string':
      field = { type: String }
      if (schema.$fastSearch) field.unique = true
      if (schema.enum) field.enum = schema.enum
      if (schema.maxLength) field.maxLength = schema.maxLength
      if (schema.minLength) field.minLength = schema.minLength
      if (schema.pattern) field.match = new RegExp(schema.pattern)
      break

    case 'number':
      field = { type: Number }
      if (schema.maximum) field.max = schema.maximum
      if (schema.minimum) field.min = schema.minimum
      if (schema.enum) field.enum = schema.enum
      break

    case 'date':
      field = { type: Date }
      if (schema.maxDate) field.max = schema.maxDate
      if (schema.minDate) field.min = schema.minDate
      break

    case 'array':
      field = [toMomgooseSchema(schema.items)]
      break

    case 'boolean':
      field = { type: Boolean }
      break

    case 'ref':
      field = { type: Types.ObjectId }
      field.ref = schema.$ref
      field.autopopulate = { maxDepth: 1 }
      break

    case 'user':
      field = { type: Types.ObjectId }
      field.ref = 'users'
      field.autopopulate = { maxDepth: 1 }
      break

    case 'file':
    case 'image':
      field = { type: String }
      break

    default:
      break;
  }

  return field
}

const mongooseSchema = toMomgooseSchema(schema)
const sch = new Schema(mongooseSchema)
console.log(mongooseSchema)
