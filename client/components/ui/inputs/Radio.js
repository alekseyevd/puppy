/* eslint-disable no-unused-vars */
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'

const RadioInput = ({label, name, value, onChange, radio }) => {
  return (
    <FormControl component="fieldset" margin="normal">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup aria-label={name} name={name} value={value} onChange={e => onChange(name, e.target.value)}>
        {
          radio.map((v, i) =>
            <FormControlLabel
              key={v+i}
              value={v}
              control={<Radio color="primary"/>}
              label={v}
            />
          )
        }
      </RadioGroup>
    </FormControl>
  )
}

export default RadioInput
