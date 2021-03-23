import validators from './validators'

export default function validate(value, options = null) {
  if (!options) return true

  let isValid = true

  if (!options.required && validators.empty(value)) return true

  Object.keys(options).forEach(key => {
    isValid = validators[key](value, options[key]) && isValid
  })

  return isValid
}
