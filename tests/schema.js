/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const { Types } = require('mongoose')

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

      // case 'array':
      //   if (field.items.type === 'string') {
      //     schema[prop] = [String]
      //   } else if (field.items.type === 'number') {
      //     schema[prop] = [Number]
      //   } // to-do if object
      //   const _schemaProps = toMomgooseSchema()

      //   break

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

  // return Object.keys(properties).reduce((schema, prop) => {
  //   const field = properties[prop]
  //   const type = field.type
  //   switch (type) {
    //   case 'string':
    //     schema[prop] = { type: String }
    //     if (field.$fastSearch) schema[prop].unique = true
    //     if (field.enum) schema[prop].enum = field.enum
    //     if (field.maxLength) schema[prop].maxLength = field.maxLength
    //     if (field.minLength) schema[prop].minLength = field.minLength
    //     if (field.pattern) schema[prop].match = new RegExp(field.pattern)
    //     break

    //   case 'number':
    //     schema[prop] = { type: Number }
    //     if (field.maximum) schema[prop].max = field.maximum
    //     if (field.minimum) schema[prop].min = field.minimum
    //     if (field.enum) schema[prop].enum = field.enum
    //     break

    //   case 'date':
    //     schema[prop] = { type: Date }
    //     if (field.maxDate) schema[prop].max = field.maxDate
    //     if (field.minDate) schema[prop].min = field.minDate
    //     break

    //   case 'array':
    //     if (field.items.type === 'string') {
    //       schema[prop] = [String]
    //     } else if (field.items.type === 'number') {
    //       schema[prop] = [Number]
    //     } // to-do if object
    //     const _schemaProps = toMomgooseSchema()

    //     break

    //   case 'boolean':
    //     schema[prop] = { type: Boolean }
    //     break

    //   case 'ref':
    //     schema[prop] = { type: Types.ObjectId }
    //     schema[prop].ref = field.$ref
    //     schema[prop].autopopulate = { maxDepth: 1 }
    //     break

    //   case 'user':
    //     schema[prop] = { type: Types.ObjectId }
    //     schema[prop].ref = 'users'
    //     schema[prop].autopopulate = { maxDepth: 1 }
    //     break

    //   case 'file':
    //   case 'image':
    //     schema[prop] = { type: String }
    //     break

    //   case 'object':
    //     schema[prop] = toMomgooseSchema(field)
    //     break

    //   default:
    //     break;
    // }

  //   if (field.$index) schema[prop].index = true
  //   if (field.$unique) schema[prop].unique = true
  //   if (field.required) schema[prop].required = true
  //   if (field.default) schema[prop].default = field.default

  //   return schema
  // }, {})
}

const mongooseSchema = toMomgooseSchema(schema)
console.log(mongooseSchema)
