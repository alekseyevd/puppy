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

export function validateForm(formControls) {
  let isFormValid = true

  // for (let control in formControls) {
  //   if (formControls.hasOwnProperty(control)) {
  //     isFormValid = formControls[control].valid && isFormValid
  //   }
  // }
  Object.keys(formControls).forEach(key => {
    isFormValid = formControls[key].valid && isFormValid
  })

  return isFormValid
}
