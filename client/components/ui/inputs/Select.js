/* eslint-disable no-unused-vars */
import {
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core'

const SelectInput = ({required, name, label, valid, touched, value, onChange, options}) => {
  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor="outlined-age-native-simple">Роль</InputLabel>
      <Select
        native
        required={required}
        error={touched && !valid}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        label={label}
        inputProps={{
          name,
        }}
      >
        <option aria-label="None" value="" />
        {
          options.map((o, i) => {
            return (
              <option key={o+i} value={typeof o === 'string' ? o : o.value}>{typeof o === 'string' ? o : o.label}</option>
            )
          })
        }
      </Select>
    </FormControl>
  )
}

export default SelectInput
