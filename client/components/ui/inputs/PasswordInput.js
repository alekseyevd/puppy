/* eslint-disable no-unused-vars */
import {
  TextField,
} from '@material-ui/core'

const PasswordInput = ({required, name, label, valid, touched, value, onChange, index, inputProps}) => {
  return <TextField
    required={required}
    type="password"
    name={name}
    label={label}
    variant="outlined"
    margin="normal"
    error={!valid && touched}
    value={value}
    onChange={e => onChange(name, e.target.value, index)}
    InputProps={inputProps || null}
  />
}

export default PasswordInput
