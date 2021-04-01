/* eslint-disable no-unused-vars */
import {
  TextField,
} from '@material-ui/core'

const TextInput = ({required, name, label, valid, touched, value, onChange}) => {
  return <TextField
    required={required}
    name={name}
    label={label}
    variant="outlined"
    margin="normal"
    error={!valid && touched}
    value={value}
    onChange={e => onChange(name, e.target.value)}
  />
}

export default TextInput
