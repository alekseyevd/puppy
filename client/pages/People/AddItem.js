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
import Control from '../../components/ui/inputs'


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
    controls: {
      name: {
        type: 'text',
        value: '',
        label: 'Имя',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      surname: {
        type: 'text',
        value: '',
        label: 'Фамилия',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      patronymic: {
        type: 'text',
        value: '',
        label: 'Отчество',
        valid: true,
        touched: false
      },
      gender: {
        type: 'radio',
        radio: ['Женcкий', 'Мужской'],
        value: null,
        label: 'Пол',
        valid: true,
        touched: false
      },
      birthdate: {
        type: 'date',
        value: null,
        label: 'Дата рождения',
        valid: true,
        touched: false,
        validation: {
          date: true
        }
      },
      phones: {
        type: 'text',
        multiple: true,
        label: 'Телефон',
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
        multiple: true,
        label: 'Email',
        value: [''],
        valid: [true],
        touched: [false],
        validation: {
          email: true
        }
      },
      passport: {
        number: {
          type: 'text',
          value: '',
          valid: true,
          touched: false
        },
        issuedDate: {
          type: 'date',
          value: null,
          valid: true,
          touched: false,
          validation: {
            date: true
          }
        },
        issuedBy: {
          type: 'text',
          value: '',
          valid: true,
          touched: false
        },
      },
    }
  })

  const toResponseData = (obj) => {
    const data = Object.keys(obj)
        .reduce((acc, key) => {
          acc[key] = obj[key].controls
            ? toResponseData(obj[key].controls)
            : obj[key].value
          return acc
        }, {})
    return data
  }

  const saveHandler = async () => {
    const data = toResponseData(state.controls)
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

  const nestedChangeHandler = (controls, name, value, index = null) => {
    const field = name.split('.')
    const key = field[0]
    if (field.length > 1) {
      field.shift()
      controls[key] = nestedChangeHandler(controls[key], field.join('.'), value)
    } else {
      if (index === null || index === undefined) {
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
    controls = nestedChangeHandler(controls, name, value, index)
    const valid = validateForm(controls)
    setState({
      valid,
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

  return (
    <>
      <DialogTitle id="form-dialog-title">Новый физ лицо</DialogTitle>
      <DialogContent className={styles.root}>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText> */}
        {
          Object.keys(state.controls).map(name => {
            const props = state.controls[name]
            return (
              <div key={name}>
                <Control name={name} {...props} onChange={handler} onRemove={remove}/>
              </div>
            )
          })
        }
        {/* <div>
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
        </div> */}
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
