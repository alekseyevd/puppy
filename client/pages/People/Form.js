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
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const Form = ({form, changeHandler, remove}) => {
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

      case 'date':
        return (
          <div key={key+i}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
              <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                format="dd.MM.yyyy"
                margin="normal"
                label={label}
                name={key}
                maxDate={new Date('3000-12-12')}
                minDate={new Date(-1, 0)}
                error={touched && !valid}
                value={value}
                onChange={value => changeHandler(key, value)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        )

      case '[text]':
        return (
          <div style={{display: 'flex', alignItems: 'center'}} key={key+i}>
            {value.map((_, j) => {
              return (
                <TextField
                  key={key+j+i}
                  name={key+j}
                  label={label}
                  variant="outlined"
                  margin="normal"
                  error={touched[j] && !valid[j]}
                  value={value[j]}
                  onChange={e => changeHandler(key, e.target.value, j)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment onClick={_ => remove(key, j)}>
                        <IconButton>
                          <HighlightOffIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )
            })}
            <Button onClick={_ => changeHandler(key, '', value.length)}>добавить еще</Button>
          </div>
        )

      default:
        break;
    }
  })
}

export default Form
