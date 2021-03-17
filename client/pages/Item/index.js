/* eslint-disable no-unused-vars */
import { Container, makeStyles, TextField, FormControl, InputLabel, Select } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import data from '../Table/data'
import { validate, validateForm } from '../../services/formValidate'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      marginTop: '10px',
      width: '25ch',
    },
    '& .MuiFormControl-root': {
      marginTop: '10px',
      width: '25ch',
    }
  },
}));

const Item = () => {
  const styles = useStyles()
  const { id } = useParams()
  const user = data.find(item => item.id === +id)

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
      },
      email: {
        value: '',
        type: 'text',
        label: 'Email',
        valid: true,
        touched: false,
      },
      phone: {
        value: '',
        type: 'text',
        label: 'Телефон',
        valid: true,
        touched: false,
      },
    }
  })

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
    <Container maxWidth={false} className={styles.root}>
      <div>
        <TextField
          required
          id="login"
          name="login"
          label="Логин"
          variant="outlined"
          value={state.formControls.login.value}
          onChange={changeHandler}
        />
      </div>
      <div>
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          value={state.formControls.password.value}
          onChange={changeHandler}
        />
      </div>
      <div>
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-age-native-simple">Роль</InputLabel>
          <Select
            native
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
          id="email"
          name="email"
          label="email"
          variant="outlined"
          value={state.formControls.email.value}
          onChange={changeHandler}
        />
      </div>
      <div>
        <TextField
          id="phone"
          name="phone"
          label="phone"
          variant="outlined"
          value={state.formControls.phone.value}
          onChange={changeHandler}
        />
      </div>
      <div>
        <TextField id="outlined-search" label="Физическое лицо" type="search" variant="outlined" />
      </div>
      <button onClick={()=>console.log(state)}>state</button>
    </Container>
  )
}

export default Item
