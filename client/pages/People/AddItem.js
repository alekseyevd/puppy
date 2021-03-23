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
} from '@material-ui/core'
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

const AddItem = ({close, addUserToState}) => {
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
        type: 'group',
        formControls: {
          number: {
            value: '',
            valid: false,
            format: 'phone',
            validation: {
              required: true
            }
          },
          issuedDate: {
            value: null,
            valid: true,
          },
          issuedBy: {
            value: '',
            valid: true,
          },
        },
        valid: true
      }
    }
  })

  const addUser = async () => {
    const data = Object.keys(state.formControls)
        .reduce((acc, key) => {
          acc[key] = state.formControls[key].value
          return acc
        }, {})
    try {
      const res = await request({
        url: '/api/people',
        method: 'POST',
        data
      })
      console.log(res);
      const user = res.data.data
      addUserToState(user)
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

  const addValue = (name) => {
    const obj = [...state.formControls[name].value]
    handler(name, '')
  }

  return (
    <>
      <DialogTitle id="form-dialog-title">Новый физ лицо</DialogTitle>
      <DialogContent className={styles.root}>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText>
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
          {state.formControls.phones.value.map((el, i) => {
            return <TextField
              key={`phone_${i}`}
              name={`phone_${i}`}
              label={`Телефон`}
              variant="outlined"
              error={state.formControls.phones.touched[i] && !state.formControls.phones.valid[i]}
              value={state.formControls.phones.value[i]}
              onChange={e => handler('phones', e.target.value, i)}
            />
          })}
          <Button onClick={_ => handler('phones', '', state.formControls.phones.value.length)}>добавить</Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirm('Вы уверены?') ? close() : null} variant="contained">
          Отменить
        </Button>
        <Button onClick={addUser} color="primary" variant="contained" disabled={!state.valid}>
          Сохранить
        </Button>
      </DialogActions>
    </>
  )
}

export default AddItem
