/* eslint-disable no-unused-vars */
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'

const DateInput = ({label, name, touched, valid, value, onChange}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} >
      <KeyboardDatePicker
        clearable="true"
        disableToolbar
        showTodayButton
        variant="inline"
        inputVariant="outlined"
        format="dd.MM.yyyy"
        margin="normal"
        label={label}
        name={name}
        maxDate={new Date('3000-12-12')}
        minDate={new Date(-1, 0)}
        error={touched && !valid}
        value={value}
        onChange={value => onChange(name, value)}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  )
}

export default DateInput
