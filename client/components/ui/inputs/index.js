import DateInput from './DateInput'
import RadioInput from './Radio'
import TextInput from './TextInput'

const types = {
  text: TextInput,
  radio: RadioInput,
  date: DateInput
}

const Control = (props) => {
  const component = types[props.type]

  if (component) return component(props)

  return null
}

export default Control

