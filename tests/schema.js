/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { Schema, model, Types } = require('mongoose')

const schema = {
  type: "document",
  properties: {
    name: {
      type: "string",
      pattern: "[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}",
      required: true,
      $index: true,
      $fastSearch: true
    },
    surname: {
      type: "string",
      $unique: true
    },
    patronymic: {type: "string"},
    gender: {
      type: "string",
      enum: ["male", "female"]
    },
    emails: {
      type: "array",
      items: {
        type: "string",
        format: "email"
      },
      maxItems: 3,
      minItems: 1
    },
    phones: {
      type: "array",
      items: {
        type: "string",
        format: "phone",
        // pattern: "[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}"
      }
    },
    address: {type: "string"},
    passport: {
      type: "document",
      properties: {
        number: {type: "string"},
        issuedDate: {
          type: "date",
        },
        issuedBy: {type: "string"},
      }
    },
    workIn: {
      type: "ref",
      $ref: "company",
    },
  },
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
console.log(sch)
