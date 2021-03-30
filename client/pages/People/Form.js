/* eslint-disable no-unused-vars */
import {
  makeStyles,
  Toolbar,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  InputAdornment,
  IconButton
} from '@material-ui/core'

const Form = ({form, changeHandler}) => {
  return Object.keys(form).map((key, i) => {
    const { type, value, label, valid, touched, radio } = form[key]
    switch (type) {
      case 'text':
        return (
          <div key={key+i}>
            <TextField
              required
              name={key}
              label={label}
              variant="outlined"
              margin="normal"
              error={touched && !valid}
              value={value}
              onChange={e => changeHandler(key, e.target.value)}
            />
          </div>
        )

      case 'radio':
        return (
          <FormControl component="fieldset" margin="normal" key={key+i}>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup aria-label={key} name={key} value={value} onChange={e => changeHandler(key, e.target.value)}>
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

      default:
        break;
    }
  })
}

export default Form
