export function validate(value, validation = null) {
  if (!validation) {
    return true
  }

  let isValid = true

  if (validation.required) {
    isValid = value.trim() !== '' && isValid
  }

  return isValid
}

export function validateForm(controls) {
  let isFormValid = true

  // Object.keys(formControls).forEach(key => {
  //   isFormValid = formControls[key].valid && isFormValid
  // })

  Object.keys(controls).forEach(name => {
    if (Array.isArray(controls[name].valid)) {
      controls[name].valid.forEach(el => {
        isFormValid = el && isFormValid
      })
    } else {
      isFormValid = controls[name].valid && isFormValid
    }
  })

  return isFormValid
}
