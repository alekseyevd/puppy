/* eslint-disable no-unused-vars */
import {
  makeStyles,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  IconButton
} from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useState } from 'react'
import { validateForm } from '../../services/formValidate'
import validate from '../../services/validation'
import format from '../../services/validation/formatting'
import { useHttp } from '../../services/http'


const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginTop: '10px',
    },
    '& .MuiFormControl-root': {
      marginTop: '10px',
      width: '100%'
    }
  },
}));

const AddItem = ({close, addItemToState}) => {
  const styles = useStyles()
  const { request, isLoading } = useHttp()

  const [state, setState] = useState({
    valid: false,
    formControls: {
      name: {
        value: '',
        label: 'Имя',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      surname: {
        value: '',
        label: 'Фамилия',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      patronymic: {
        value: '',
        label: 'Отчество',
        valid: true,
        touched: false
      },
      gender: {
        value: '',
        label: 'Пол',
        valid: true,
        touched: false
      },
      birthdate: {
        value: null,
        type: 'date',
        label: 'Дата рождения',
        valid: true,
        touched: false,
        validation: {
          date: true
        }
      },
      phones: {
        type: 'text',
        label: 'Телефон',
        multi: true,
        format: 'phone',
        value: [''],
        valid: [true],
        touched: [false],
        validation: {
          match: '[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}'
        }
      },
      emails: {
        type: 'text',
        label: 'Email',
        multi: true,
        value: [''],
        valid: [true],
        touched: [false],
        validation: {
          email: true
        }
      },
      passport: {
        valid: true,
        formControls: {
          number: {
            value: '',
            valid: true,
            touched: false
          },
          issuedDate: {
            value: null,
            valid: true,
            touched: false,
            validation: {
              date: true
            }
          },
          issuedBy: {
            value: '',
            valid: true,
            touched: false
          },
        },
      }
    }
  })

  const toResponseData = (obj) => {
    const data = Object.keys(obj)
        .reduce((acc, key) => {
          acc[key] = obj[key].formControls
            ? toResponseData(obj[key].formControls)
            : obj[key].value
          return acc
        }, {})
    return data
  }

  const saveHandler = async () => {
    const data = toResponseData(state.formControls)
    try {
      const res = await request({
        url: '/api/people',
        method: 'POST',
        data
      })
      console.log(res);
      addItemToState(res.data.data)
      close()
    } catch (error) {
      console.log(error);
    }
  }

  const nestedtChangeHandler = (obj, name, value, index = null) => {
    const formControls = obj.formControls
    const field = name.split('.')
    const key = field[0]
    if (field.length > 1) {
      field.shift()
      formControls[key] = nestedtChangeHandler(formControls[key], field.join('.'), value)
    } else {
      if (index === null) {
        formControls[key].touched = true
        formControls[key].value = formControls[key].format
          ? format[formControls[key].format](value)
          : value
        formControls[key].valid = validate(formControls[key].value, formControls[key].validation)
      } else {
        formControls[key].touched[index] = true
        formControls[key].value[index] = formControls[key].format
          ? format[formControls[key].format](value)
          : value
        formControls[key].valid[index] = validate(formControls[key].value[index], formControls[key].validation)
      }
    }

    obj.valid = validateForm(formControls)
    return obj
  }

  const handler = (name, value, index = null) => {
    let obj = JSON.parse(JSON.stringify(state))
    obj = nestedtChangeHandler(obj, name, value, index)
    setState(obj)
  }

  const remove = (name, index) => {
    const obj = JSON.parse(JSON.stringify(state))
    obj.formControls[name].value.splice(index, 1)
    obj.formControls[name].valid.splice(index, 1)
    obj.formControls[name].touched.splice(index, 1)
    if (obj.formControls[name].value.length === 0) {
      obj.formControls[name].value[0] = ''
      obj.formControls[name].valid[0] = validate(obj.formControls[name].value, obj.formControls[name].validation)
      obj.formControls[name].touched[0] = true
    }

    obj.valid = validateForm(obj.formControls)
    setState(obj)
  }

  return (
    <>
      <DialogTitle id="form-dialog-title">Новый физ лицо</DialogTitle>
      <DialogContent className={styles.root}>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText> */}
        <div>
          <TextField
            required
            fullWidth
            name="name"
            label="Имя"
            variant="outlined"
            error={state.formControls.name.touched && !state.formControls.name.valid}
            value={state.formControls.name.value}
            onChange={e => handler('name', e.target.value)}
          />
        </div>
        <div>
          <TextField
            required
            fullWidth
            name="surname"
            label="Фамилия"
            variant="outlined"
            error={state.formControls.surname.touched && !state.formControls.surname.valid}
            value={state.formControls.surname.value}
            onChange={e => handler('surname', e.target.value)}
          />
        </div>
        <div>
          <TextField
            required
            fullWidth
            name="patronymic"
            label="Отчество"
            variant="outlined"
            error={state.formControls.patronymic.touched && !state.formControls.patronymic.valid}
            value={state.formControls.patronymic.value}
            onChange={e => handler('patronymic', e.target.value)}
          />
        </div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Пол</FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={state.formControls.gender.value} onChange={e => handler('gender', e.target.value)}>
              <FormControlLabel value="female" control={<Radio color="primary"/>} label="Женщина" />
              <FormControlLabel value="male" control={<Radio color="primary"/>} label="Мужчина" />
            </RadioGroup>
          </FormControl>
        </div>
        <div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              inputVariant="outlined"
              format="dd.MM.yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Дата рождения"
              name="birthdate"
              maxDate={new Date('3000-12-12')}
              minDate={new Date(-1, 0)}
              value={state.formControls.birthdate.value}
              onChange={value => handler('birthdate', value)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div>
          <FormControl component="fieldset">
            <FormLabel component="legend">Паспорт</FormLabel>
            <TextField
              name="passportno"
              label="Номер"
              variant="outlined"
              error={state.formControls.passport.formControls.number.touched && !state.formControls.passport.formControls.number.valid}
              value={state.formControls.passport.formControls.number.value}
              onChange={e => handler('passport.number', e.target.value)}
            />
            <TextField
              name="issuedby"
              label="Кем выдан"
              variant="outlined"
              error={state.formControls.passport.formControls.issuedBy.touched && !state.formControls.passport.formControls.issuedBy.valid}
              value={state.formControls.passport.formControls.issuedBy.value}
              onChange={e => handler('passport.issuedBy', e.target.value)}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                inputVariant="outlined"
                format="dd.MM.yyyy"
                margin="normal"
                label="Дата выдачи"
                name="issued"
                maxDate={new Date('3000-12-12')}
                minDate={new Date(-1, 0)}
                value={state.formControls.passport.formControls.issuedDate.value}
                onChange={value => handler('passport.issuedDate', value)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
          </FormControl>
        </div>
        <div>
          {state.formControls.phones.value.map((_, i) => {
            return (
              <TextField
                key={`phone_${i}`}
                name={`phone_${i}`}
                label={`Телефон`}
                variant="outlined"
                error={state.formControls.phones.touched[i] && !state.formControls.phones.valid[i]}
                value={state.formControls.phones.value[i]}
                onChange={e => handler('phones', e.target.value, i)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment onClick={_ => remove('phones', i)}>
                      <IconButton>
                        <HighlightOffIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )
          })}
          <Button onClick={_ => handler('phones', '', state.formControls.phones.value.length)}>добавить еще</Button>
        </div>
        <div>
          {state.formControls.emails.value.map((_, i) => {
            return (
              <TextField
                key={`emails${i}`}
                name={`emails${i}`}
                label={`Email`}
                variant="outlined"
                error={state.formControls.emails.touched[i] && !state.formControls.emails.valid[i]}
                value={state.formControls.emails.value[i]}
                onChange={e => handler('emails', e.target.value, i)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment onClick={_ => remove('emails', i)}>
                      <IconButton>
                        <HighlightOffIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )
          })}
          <Button onClick={_ => handler('emails', '', state.formControls.emails.value.length)}>добавить еще</Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirm('Вы уверены?') ? close() : null} variant="contained">
          Отменить
        </Button>
        <Button onClick={saveHandler} color="primary" variant="contained" disabled={!state.valid}>
          Сохранить
        </Button>
      </DialogActions>
    </>
  )
}

export default AddItem
