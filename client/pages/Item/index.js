/* eslint-disable no-unused-vars */
import {
  Container,
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
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { validate, validateForm } from '../../services/formValidate'
import { useHttp } from '../../services/http';

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

const Item = ({close, addUserToState}) => {
  const styles = useStyles()
  const { request, isLoading } = useHttp()
  const { id } = useParams()

  const [state, setState] = useState({
    isFormValid: false,
    formControls: {
      login: {
        value: '',
        type: 'text',
        label: 'Логин',
        errorMessage: 'Введите логин',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      password: {
        value: '',
        type: 'password',
        label: 'Пароль',
        errorMessage: 'Введите пароль',
        valid: false,
        touched: false,
        validation: {
          required: true
        }
      },
      role: {
        value: '',
        type: 'select',
        label: 'Роль',
        valid: false,
        touched: false,
        validation: {
          required: true
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
        url: '/api/users',
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
    // setState({ ...state, [event.target.name]: event.target.value })
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
      <DialogTitle id="form-dialog-title">Новый пользователь</DialogTitle>
      <DialogContent className={styles.root}>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText>
        <div>
          <TextField
            required
            fullWidth
            id="login"
            name="login"
            label="Логин"
            variant="outlined"
            error={state.formControls.login.touched && !state.formControls.login.valid}
            value={state.formControls.login.value}
            onChange={changeHandler}
          />
        </div>
        <div>
          <TextField
            required
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            variant="outlined"
            error={state.formControls.password.touched && !state.formControls.password.valid}
            value={state.formControls.password.value}
            onChange={changeHandler}
          />
        </div>
        <div>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">Роль</InputLabel>
            <Select
              native
              error={state.formControls.role.touched && !state.formControls.role.valid}
              value={state.formControls.role.value}
              onChange={changeHandler}
              label="Роль"
              inputProps={{
                name: 'role',
                id: 'outlined-age-native-simple',
              }}
            >
              <option aria-label="None" value="" />
              <option value={'admin'}>Администратор</option>
              <option value={'user'}>Пользователь</option>
            </Select>
          </FormControl>
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

export default Item
