/* eslint-disable no-unused-vars */
import { useParams, useHistory } from 'react-router-dom'
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
import SelectRef from './SelectRef'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useState, useEffect } from 'react'
import { validateForm } from '../../services/formValidate'
import validate from '../../services/validation'
import format from '../../services/validation/formatting'
import { useHttp } from '../../services/http'

const Item = () => {
  const { request, isLoading } = useHttp()
  const id = useParams().id
  const history = useHistory()

  const [state, setState] = useState({
    valid: false,
    controls: {
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
      addedBy: {
        value: null,
        type: 'ref',
        touched: false,
        valid: true,
        options: {
          ref: 'users',
          inputValue: 'login'
        }
      }
    }
  })

  const [isReady, setReady] = useState(false)

  const toResponseData = (controls) => {
    const data = Object.keys(controls)
        .reduce((acc, key) => {
          acc[key] = !Object.prototype.hasOwnProperty.call(controls[key], 'value')
            ? toResponseData(controls[key])
            : controls[key].type === 'ref' && controls[key].value !== null
              ? controls[key].value._id
              : controls[key].value
          return acc
        }, {})
    return data
  }

  const saveHandler = async (_, shouldClose = false) => {
    const data = toResponseData(state.controls)
    try {
      const res = await request({
        url: `/api/people/${id}`,
        method: 'POST',
        data
      })
      if (shouldClose) close()
    } catch (error) {
      console.log(error)
    }
  }

  const nestedtChangeHandler = (controls, name, value, index = null) => {
    const field = name.split('.')
    const key = field[0]
    if (field.length > 1) {
      field.shift()
      controls[key] = nestedtChangeHandler(controls[key], field.join('.'), value)
    } else {
      if (index === null) {
        controls[key].touched = true
        controls[key].value = format(value, controls[key].format)
        controls[key].valid = validate(controls[key].value, controls[key].validation)
      } else {
        controls[key].touched[index] = true
        controls[key].value[index] = format(value, controls[key].format)
        controls[key].valid[index] = validate(controls[key].value[index], controls[key].validation)
      }
    }

    return controls
  }

  const handler = (name, value, index = null) => {
    let controls = JSON.parse(JSON.stringify(state.controls))
    controls = nestedtChangeHandler(controls, name, value, index)
    setState({
      valid: validateForm(controls),
      controls
    })
  }

  const remove = (name, index) => {
    const controls = JSON.parse(JSON.stringify(state.controls))
    controls[name].value.splice(index, 1)
    controls[name].valid.splice(index, 1)
    controls[name].touched.splice(index, 1)
    if (controls[name].value.length === 0) {
      controls[name].value[0] = ''
      controls[name].valid[0] = true
      controls[name].touched[0] = true
    }
    setState({
      valid: validateForm(controls),
      controls
    })
  }

  const close = () => {
    history.push('/people')
  }

  const toStateData = (obj, controls) => {
    // to-do use types control.type === 'date
    Object.keys(controls).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(controls[key], 'value') && obj[key]) {
        controls[key] = toStateData(obj[key], controls[key])
      } else if (controls[key].type !== 'ref' && obj[key]) {
        const isArray = Array.isArray(controls[key].value)
        controls[key].value = isArray
          ? [...obj[key]]
          : obj[key]
        controls[key].valid = isArray
          ? obj[key].map(val => validate(val, controls[key].validation))
          : validate(obj[key], controls[key].validation)
        controls[key].touched = isArray
          ? obj[key].map(_ => true)
          : true
      } else if (controls[key].type === 'ref' && obj[key]) {
        controls[key].value = obj[key]
      }
    })
    return controls
  }

  useEffect(async () => {
    try {
      const response = await request(`/api/people/${id}`)
      console.log(response);

      let controls = JSON.parse(JSON.stringify(state.controls))
      controls = toStateData(response.data.data, controls)

      setState({ ...state, controls})
      setReady(true)
    } catch (error) {
      console.log(error);
    }
  }, [request])

  if (isLoading || !isReady) return <div>Loading...</div>

  return (
    <div>
      <Toolbar>
        <Button variant="contained" color="primary" disabled={!state.valid} onClick={saveHandler}>Сохранить</Button>
        <Button variant="contained" disabled={!state.valid} onClick={saveHandler.bind(null, true)}>Сохранить и закрыть</Button>
        <Button variant="contained" onClick={close}>Закрыть</Button>
      </Toolbar>
      <div>
        <TextField
          required
          name="name"
          label="Имя"
          variant="outlined"
          error={state.controls.name.touched && !state.controls.name.valid}
          value={state.controls.name.value}
          onChange={e => handler('name', e.target.value)}
        />
      </div>
      <div>
        <TextField
          required
          name="surname"
          label="Фамилия"
          variant="outlined"
          error={state.controls.surname.touched && !state.controls.surname.valid}
          value={state.controls.surname.value}
          onChange={e => handler('surname', e.target.value)}
        />
      </div>
      <div>
        <TextField
          required
          name="patronymic"
          label="Отчество"
          variant="outlined"
          error={state.controls.patronymic.touched && !state.controls.patronymic.valid}
          value={state.controls.patronymic.value}
          onChange={e => handler('patronymic', e.target.value)}
        />
      </div>
      <div>
        <FormControl component="fieldset">
          <FormLabel component="legend">Пол</FormLabel>
          <RadioGroup aria-label="gender" name="gender1" value={state.controls.gender.value} onChange={e => handler('gender', e.target.value)}>
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
            error={state.controls.birthdate.touched && !state.controls.birthdate.valid}
            value={state.controls.birthdate.value}
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
            error={state.controls.passport.number.touched && !state.controls.passport.number.valid}
            value={state.controls.passport.number.value}
            onChange={e => handler('passport.number', e.target.value)}
          />
          <TextField
            name="issuedby"
            label="Кем выдан"
            variant="outlined"
            error={state.controls.passport.issuedBy.touched && !state.controls.passport.issuedBy.valid}
            value={state.controls.passport.issuedBy.value}
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
              error={state.controls.passport.issuedDate.touched && !state.controls.passport.issuedDate.valid}
              value={state.controls.passport.issuedDate.value}
              onChange={value => handler('passport.issuedDate', value)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </div>
      <div>
        {state.controls.phones.value.map((_, i) => {
          return (
            <TextField
              key={`phone_${i}`}
              name={`phone_${i}`}
              label={`Телефон`}
              variant="outlined"
              error={state.controls.phones.touched[i] && !state.controls.phones.valid[i]}
              value={state.controls.phones.value[i]}
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
        <Button onClick={_ => handler('phones', '', state.controls.phones.value.length)}>добавить еще</Button>
      </div>
      <div>
        {state.controls.emails.value.map((_, i) => {
          return (
            <TextField
              key={`emails${i}`}
              name={`emails${i}`}
              label={`Email`}
              variant="outlined"
              error={state.controls.emails.touched[i] && !state.controls.emails.valid[i]}
              value={state.controls.emails.value[i]}
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
        <Button onClick={_ => handler('emails', '', state.controls.emails.value.length)}>добавить еще</Button>
      </div>
      <div>
        <SelectRef
          onSelect={(value) => handler('addedBy', value)}
          value={state.controls.addedBy.value}
          options={state.controls.addedBy.options}
          label="addedBy"
        />
      </div>
    </div>
  )
}

export default Item
