/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'

const RadioInput = ({label, name, value, onChange, options }) => {
  return (
    <FormControl component="fieldset" margin="normal">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup aria-label={name} name={name} value={value} onChange={e => onChange(name, e.target.value)}>
        {
          options.map((o, i) =>
            <FormControlLabel
              key={o+i}
              value={typeof o === 'string' ? o : o.value}
              control={<Radio color="primary"/>}
              label={typeof o === 'string' ? o : o.label}
            />
          )
        }
      </RadioGroup>
    </FormControl>
  )
}

export default RadioInput
