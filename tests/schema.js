/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { Types } = require('mongoose')

const schema = {
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
      type: "object",
      properties: {
        number: {type: "string"},
        issuedDate: {
          type: "string",
          format: "date"
        },
        issuedBy: {type: "string"},
      }
    },
    workIn: {
      type: "string",
      $ref: "company",
    },
  },
}

function toMomgooseSchema(jsonSchema) {
  const properties = jsonSchema.properties
  Object.keys(properties).reduce((schema, prop) => {
    const field = properties[prop]
    const type = field.type
    switch (type) {
      case 'string':
        schema[prop] = { type: String }
        if (field.$fastSearch) schema[prop].unique = true
        if (field.enum) schema[prop].enum = field.enum
        if (field.maxLength) schema[prop].maxLength = field.maxLength
        if (field.minLength) schema[prop].minLength = field.minLength
        if (field.pattern) schema[prop].match = new RegExp(field.pattern)
        break

      case 'number':
        schema[prop] = { type: Number }
        if (field.maximum) schema[prop].max = field.maximum
        if (field.minimum) schema[prop].min = field.minimum
        if (field.enum) schema[prop].enum = field.enum
        break

      case 'date':
        schema[prop] = { type: Date }
        if (field.maxDate) schema[prop].max = field.maxDate
        if (field.minDate) schema[prop].min = field.minDate
        break

      case 'array':
        if (field.items.type === 'string') {
          schema[prop] = [String]
        } else if (field.items.type === 'number') {
          schema[prop] = [Number]
        } // to-do if object
        break

      case 'boolean':
        schema[prop] = { type: Boolean }
        break

      case 'ref':
        schema[prop] = { type: Types.ObjectId }
        schema[prop].ref = field.$ref
        schema[prop].autopopulate = { maxDepth: 1 }
        break

      case 'user':
        schema[prop] = { type: Types.ObjectId }
        schema[prop].ref = 'users'
        schema[prop].autopopulate = { maxDepth: 1 }
        break

      case 'file':
      case 'image':
        schema[prop] = { type: String }
        break

      default:
        break;
    }

    if (field.$index) schema[prop].index = true
    if (field.$unique) schema[prop].unique = true
    if (field.required) schema[prop].required = true
    if (field.default) schema[prop].default = field.default

    return schema
  }, {})
}
