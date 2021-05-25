/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      pattern: "[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}",
      $index: true,
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
  required: ["name", "surname"],
}

const validate = (obj, schema, property = 'root') => {
  if (!validate.errors) validate.errors = []
  let type = typeof obj
  if (obj === null) type = 'null'
  if (Array.isArray(obj)) type = 'array'
  if (type === 'number' && Number.isInteger(obj)) type = 'integer'

  if (schema.type !== type) {
    validate.errors.push(`invalid type in property '${property}'. Expect ${schema.type} instead of ${type} ${obj}`)
  }

  switch (type) {
    case 'object':
      Object.keys(schema.properties).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          validate(obj[key], schema.properties[key], key)
        } else if (Array.isArray(schema.required) && schema.required.includes(key)) {
          validate.errors.push(`property '${key}' is requried in ${property}`)
        }
      })

      break;

    case 'string':
      if (Array.isArray(schema.enum) && !schema.enum.includes(obj)) {
        validate.errors.push(`value of property ${property} is not one of enum [${schema.enum.join(', ')}]`)
        break
      }

      if (schema.pattern && typeof schema.pattern === 'string') {
        const regexp = new RegExp(schema.pattern)
        const match = obj.match(regexp) || []
        if (obj !== match[0]) validate.errors.push(`Value of property '${property}' doesn't match pattern '${schema.pattern}'`)
      }

      if (schema.maxLength && typeof schema.maxLength === 'number' && obj.length > schema.maxLength) {
        validate.errors.push(`Maxlength of property '${property}' must be not more than ${schema.maxLength}`)
      } else if (schema.minLength && typeof schema.minLength === 'number' && obj.length < schema.minLength) {
        validate.errors.push(`Minlength of property '${property}' must be not less than ${schema.minLength}`)
      }

      break

    case 'number':
      if (Array.isArray(schema.enum) && !schema.enum.includes(obj)) {
        validate.errors.push(`value of '${property}' is not one of enum [${schema.enum.join(', ')}]`)
        break
      }

      if (schema.minimum && typeof schema.minimum === 'number' && obj < schema.minimum) {
        validate.errors.push(`value of '${property}' must be not less than ${schema.minimum}`)
      } else if (schema.maximum && typeof schema.maximum === 'number' && obj > schema.maximum) {
        validate.errors.push(`value of '${property}' must be not more than ${schema.maximum}`)
      } else if (schema.multipleOf && typeof schema.multipleOf === 'number' && Number.isInteger(obj / schema.multipleOf)) {
        validate.errors.push(`value of property '${property} is not multiple of ${schema.multipleOf}`)
      }

      break

    case 'array':
      if (schema.maxItems && typeof schema.maxItems === 'number' && obj.length > schema.maxItems) {
        validate.errors.push(`Maxlength of array '${property}' must be not more than ${schema.maxItems}`);
      } else if (schema.minItems && typeof schema.minItems === 'number' && obj.length < schema.minItems) {
        validate.errors.push(`Maxlength of array '${property}' must be not less than ${schema.minItems}`);
      } else if (schema.items) {
        obj.forEach(el => {
          validate(el, schema.items, property)
        })
      }

      break

    default:
      break;
  }

  return validate.errors.length === 0
}

function toMomgooseSchema(jsonSchema) {
  const properties = jsonSchema.properties
  Object.keys(properties).reduce((acc, prop) => {
    const type = properties[prop].type
    switch (type) {
      case 'string':
        acc[prop] = { type: String }
        break;

      default:
        break;
    }
    return acc
  }, {})
}

const object = {
  name: '7 921 938 49 92',
  emails: ['dfg', 'dfg', '5']
}
const res = validate(object, schema)
console.log(res);
console.log(validate.errors);
