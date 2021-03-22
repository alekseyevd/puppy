/* eslint-disable no-unused-vars */
import {
  makeStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useState } from 'react'
import { validate, validateForm } from '../../services/formValidate'
import { useHttp } from '../../services/http';
import e from 'cors';

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
    isFormValid: false,
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
        valid: false,
        touched: false
      },
      gender: {
        value: '',
        label: 'Пол',
        valid: false,
        touched: false
      },
      birthdate: {
        value: '',
        label: 'Дата рождения',
        valid: true
      },
      phones: {
        type: 'text',
        label: 'Телефон',
        multi: true,
        mask: 'phone',
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
        controls: {
          number: {
            value: ''
          },
          issuedDate: {
            value: ''
          },
          issuedBy: {
            value: ''
          },
        }
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

  const changeHandler = event => {
    console.log(event);
    const formControls = {...state.formControls}
    const control = { ...formControls[event.target.name]}

    control.touched = true
    control.value = event.target.value
    control.valid = validate(control.value, control.validation)

    formControls[event.target.name] = control
    setState({
      formControls,
      isFormValid: validateForm(formControls)
    })
  }

  // to-do post request to api/users

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
            onChange={changeHandler}
          />
        </div>
        <div>
          <TextField
            required
            fullWidth
            name="surname"
            label="surname"
            variant="outlined"
            error={state.formControls.surname.touched && !state.formControls.surname.valid}
            value={state.formControls.surname.value}
            onChange={changeHandler}
          />
        </div>
        <div>
          <TextField
            required
            fullWidth
            name="patronymic"
            label="patronymic"
            variant="outlined"
            error={state.formControls.patronymic.touched && !state.formControls.patronymic.valid}
            value={state.formControls.patronymic.value}
            onChange={changeHandler}
          />
        </div>
        <div>
          <TextField
            required
            fullWidth
            name="gender"
            label="gender"
            variant="outlined"
            error={state.formControls.gender.touched && !state.formControls.gender.valid}
            value={state.formControls.gender.value}
            onChange={changeHandler}
          />
        </div>
        <div>
          {/* <TextField
            fullWidth
            type="datetime-local"
            defaultValue=""
            name="birthdate"
            label="birthdate"
            variant="outlined"
            error={state.formControls.birthdate.touched && !state.formControls.birthdate.valid}
            value={state.formControls.birthdate.value}
            onChange={changeHandler}
          /> */}
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              name="birthdate"
              value={state.formControls.birthdate.value}
              // onChange={(value) => changeHandler(e, value)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirm('Вы уверены?') ? close() : null} variant="contained">
          Отменить
        </Button>
        <Button onClick={addUser} color="primary" variant="contained" disabled={!state.isFormValid}>
          Сохранить
        </Button>
      </DialogActions>
    </>
  )
}

export default AddItem
