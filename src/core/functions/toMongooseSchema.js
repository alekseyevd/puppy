const { Types } = require('mongoose')

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
      if (schema.fastSearch) field.unique = true
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

module.exports = toMomgooseSchema
