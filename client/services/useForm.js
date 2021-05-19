import { useState } from 'react'
import validate from './validation'
import format from './validation/formatting'
import { validateForm } from './formValidate'

export const useForm = (params) => {
  const initialState = {
    valid: false,
    controls: params.initial
  }

  const [state, setState] = useState(initialState)

  const toResponseData = (controls) => {
    const data = Object.keys(controls)
        .reduce((acc, key) => {
          acc[key] = !Object.prototype.hasOwnProperty.call(controls[key], 'value')
            ? toResponseData(controls[key])
            : controls[key].type === 'ref' && controls[key].value !== null
              ? controls[key].value._id
              : controls[key].value
          return acc
        }, {})
    return data
  }

  const handleSubmit = (e, ...par) => {
    const data = toResponseData(state.controls)
    params.onSubmit(data, ...par)
  }

  const nestedChangeHandler = (controls, name, value, index = null) => {
    const field = name.split('.')
    const key = field[0]
    if (field.length > 1) {
      field.shift()
      controls[key] = nestedChangeHandler(controls[key], field.join('.'), value)
    } else {
      if (index === null || index === undefined) {
        controls[key].touched = true
        controls[key].value = format(value, controls[key].format)
        controls[key].valid = validate(controls[key].value, controls[key].validation)
      } else {
        controls[key].touched[index] = true
        controls[key].value[index] = format(value, controls[key].format)
        controls[key].valid[index] = validate(controls[key].value[index], controls[key].validation)
      }
    }

    return controls
  }

  const handleChange = (name, value, index = null) => {
    let controls = JSON.parse(JSON.stringify(state.controls))
    controls = nestedChangeHandler(controls, name, value, index)
    setState({
      valid: validateForm(controls),
      controls
    })
  }

  const handleRemove = (name, index) => {
    const controls = JSON.parse(JSON.stringify(state.controls))
    controls[name].value.splice(index, 1)
    controls[name].valid.splice(index, 1)
    controls[name].touched.splice(index, 1)
    if (controls[name].value.length === 0) {
      controls[name].value[0] = ''
      controls[name].valid[0] = true
      controls[name].touched[0] = true
    }
    setState({
      valid: validateForm(controls),
      controls
    })
  }

  const nestedStateData = (data, stateControls) => {
    // to-do use types control.type === 'date
    const controls = JSON.parse(JSON.stringify(stateControls))
    Object.keys(controls).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(controls[key], 'value') && data[key]) {
        controls[key] = nestedStateData(data[key], controls[key])
      } else if (controls[key].type !== 'ref') {
        const isArray = Array.isArray(controls[key].value)
        controls[key].value = isArray
          ? [...data[key]]
          : data[key] || ''
        controls[key].valid = isArray
          ? data[key].map(val => validate(val, controls[key].validation))
          : validate(data[key], controls[key].validation)
        controls[key].touched = isArray
          ? data[key].map(_ => true)
          : true
      } else if (controls[key].type === 'ref' && data[key]) {
        controls[key].value = data[key]
        controls[key].valid = validate(data[key], controls[key].validation)
      }
    })

    return controls
  }

  const toStateData = (data) => {
    const controls = nestedStateData(data, state.controls)
    setState({ ...state, controls})
  }

  return {
    state,
    toStateData,
    handleChange,
    handleSubmit,
    handleRemove
  }
}
