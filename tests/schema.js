/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 5,
    },
    surname: {type: "string"},
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
      }
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
      ref: "company",
    },
  },
  required: ["name", "surname"],
}

const validate = (obj, schema, property = 'root') => {
  if (!validate.errors) validate.errors = []
  let result = true
  let type = typeof obj
  if (obj === null) type = 'null'
  if (Array.isArray(obj)) type = 'array'
  if (type === 'number' && Number.isInteger(obj)) type = 'integer'

  if (schema.type !== type) {
    validate.errors.push(`invalid type in property '${property}'. Expect ${schema.type} instead of ${type} ${obj}`)
    return false
  }

  switch (type) {
    case 'object':
      Object.keys(schema.properties).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result = result && validate(obj[key], schema.properties[key], key)
        } else if (Array.isArray(schema.required) && schema.required.includes(key)) {
          validate.errors.push(`property '${key}' is requried in ${property}`)
          result = false
        }
      })

      break;

    case 'string':
      if (Array.isArray(schema.enum) && !schema.enum.includes(obj)) {
        validate.errors.push(`value of ${property} is not one of enum [${schema.enum.join(', ')}]`)
        result = false
        break;
      }

      if (schema.maxLength && typeof schema.maxLength === 'number' && obj.length > schema.maxLength) {
        validate.errors.push(`Maxlength of '${property}' must be not more than ${schema.maxLength}`)
        result = false
        break;
      }

      if (schema.minLength && typeof schema.minLength === 'number' && obj.length < schema.minLength) {
        validate.errors.push(`Minlength of '${property}' must be not less than ${schema.minLength}`)
        result = false
        break;
      }

      break;

    case 'number':
      if (Array.isArray(schema.enum) && !schema.enum.includes(obj)) {
        validate.errors.push(`value of ${property} is not one of enum [${schema.enum.join(', ')}]`)
        result = false
        break;
      }

      if (schema.minimum && typeof schema.minimum === 'number' && obj < schema.minimum) {
        validate.errors.push(`value of ${property} must be not less than ${schema.minimum}`)
        result = false
        break;
      }

      if (schema.maximum && typeof schema.maximum === 'number' && obj > schema.maximum) {
        validate.errors.push(`value of ${property} must be not more than ${schema.maximum}`)
        result = false
        break;
      }

      break;
    default:
      break;
  }

  return result
}

const object = {
  name: 'ivan bhg'
}
const res = validate(object, schema)
console.log(res);
console.log(validate.errors);
