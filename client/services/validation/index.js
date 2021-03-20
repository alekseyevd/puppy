import validators from './validators'

export default function validate(value, options = null) {
  if (!options) return true

  let isValid = true

  if (options.mayBeEmpty && value.trim === '') return true

  Object.keys(options).forEach(key => {
    if (key === 'mayBeEmpty') {
      continue
    }
    isValid = validators[key](value) && isValid
  })

  return isValid
}
