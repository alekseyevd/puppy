/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router';
import validate from '../../services/validation'
import format from '../../services/validation/formatting'
import {validateForm} from '../../services/formValidate'
import {
  makeStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Button,
  Toolbar
} from '@material-ui/core'
import { useHttp } from '../../services/http';

const Item = () => {
  const { request, isLoading } = useHttp()
  const id = useParams().id
  const history = useHistory()

  const [state, setState] = useState({
    isFormValid: true,
    formControls: {
      login: {
        value: '',
        type: 'text',
        label: 'Логин',
        errorMessage: 'Введите логин',
        valid: true,
        touched: true,
        validation: {
          required: true
        }
      },
      password: {
        value: '',
        type: 'password',
        label: 'Пароль',
        errorMessage: 'Введите пароль',
        valid: true,
        touched: true
      },
      role: {
        value: '',
        type: 'select',
        label: 'Роль',
        valid: true,
        touched: true,
        validation: {
          required: true
        }
      },
      phone: {
        value: '',
        label: 'Телефон',
        valid: true,
        touched: true,
        format: 'phone',
        validation: {
          match: '[0-9]{1} [0-9]{3} [0-9]{3} [0-9]{2} [0-9]{2}'
        }
      },
      email: {
        value: '',
        label: 'Email',
        valid: true,
        touched: true,
        validation: {
          email: true
        }
      },
    }
  })
  const [isReady, setReady] = useState(false)

  const changeHandler = event => {
    const formControls = {...state.formControls}
    const control = { ...formControls[event.target.name]}

    control.touched = true
    // control.value = event.target.value
    control.value = control.format
        ? format[control.format](event.target.value)
        : event.target.value
    control.valid = validate(control.value, control.validation)

    formControls[event.target.name] = control
    setState({
      formControls,
      isFormValid: validateForm(formControls)
    })
  }

  const updateUser = async (_, shouldClose = false) => {
    const data = Object.keys(state.formControls)
        .reduce((acc, key) => {
          acc[key] = state.formControls[key].value
          return acc
        }, {})
    try {
      const res = await request({
        url: `/api/users/${id}`,
        method: 'POST',
        data
      })
      console.log(res)
      if (shouldClose) close()
    } catch (error) {
      console.log(error);
    }
  }

  const close = () => {
    history.push('/users')
  }

  useEffect(async () => {
    try {
      const response = await request(`/api/users/${id}`)
      console.log(response);
      const newState = JSON.parse(JSON.stringify(state))
      Object.keys(newState.formControls).forEach(key => {
        newState.formControls[key].value = response.data.data[key] || ''
      })
      setReady(true)
      setState(newState)
    } catch (error) {
      console.log(error);
    }
  }, [request])

  if (isLoading || !isReady) return <div>Loading...</div>

  return (
    <div>
      <Toolbar>
        <Button variant="contained" color="primary" disabled={!state.isFormValid} onClick={updateUser}>Сохранить</Button>
        <Button variant="contained" disabled={!state.isFormValid} onClick={updateUser.bind(null, true)}>Сохранить и закрыть</Button>
        <Button variant="contained" onClick={close}>Закрыть</Button>
      </Toolbar>
      <div>
        <TextField
          required
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
      <div>
        <TextField
          id="phone"
          name="phone"
          label="Телефон"
          variant="outlined"
          error={state.formControls.phone.touched && !state.formControls.phone.valid}
          value={state.formControls.phone.value}
          onChange={changeHandler}
        />
      </div>
      <div>
        <TextField
          id="email"
          name="email"
          label="Email"
          variant="outlined"
          error={state.formControls.email.touched && !state.formControls.email.valid}
          value={state.formControls.email.value}
          onChange={changeHandler}
        />
      </div>
    </div>
  )
}

export default Item
