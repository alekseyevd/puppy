/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { validate, validateForm } from '../services/formValidate'
import styles from './login.module.css'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default function() {
  const [state, setState] = useState({
    isFormValid: false,
    formControls: {
      login: {
        value: '',
        type: 'text',
        label: 'Email',
        errorMessage: 'Введите ллогин',
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
      }
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

  const submitHandler = (e) => {
    e.preventDefault()
    console.log(state)
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={styles.container}>
        <form onSubmit={submitHandler}>
          <TextField
            error={state.formControls.login.touched && !state.formControls.login.valid}
            variant="outlined"
            margin="normal"
            fullWidth
            id="login"
            label="login"
            name="login"
            autoComplete="login"
            autoFocus
            onChange={changeHandler}
          />
          <TextField
            error={state.formControls.password.touched && !state.formControls.password.valid}
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={changeHandler}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={!state.isFormValid}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  )
}

