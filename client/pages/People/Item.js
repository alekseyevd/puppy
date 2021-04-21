/* eslint-disable no-unused-vars */
import { useParams, useHistory } from 'react-router-dom'
import {
  Toolbar,
  Button,
} from '@material-ui/core'
import { useState, useEffect } from 'react'
import { validateForm } from '../../services/formValidate'
import validate from '../../services/validation'
import format from '../../services/validation/formatting'
import { useHttp } from '../../services/http'
import Control from '../../components/ui/inputs'
import formControls from './formControls'

const Item = () => {
  const { request, isLoading } = useHttp()
  const id = useParams().id
  const history = useHistory()

  const [state, setState] = useState(formControls)
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

  const toStateData = (data, stateControls) => {
    // to-do use types control.type === 'date
    const controls = JSON.parse(JSON.stringify(stateControls))
    Object.keys(controls).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(controls[key], 'value') && data[key]) {
        controls[key] = toStateData(data[key], controls[key])
      } else if (controls[key].type !== 'ref' && data[key]) {
        const isArray = Array.isArray(controls[key].value)
        controls[key].value = isArray
          ? [...data[key]]
          : data[key]
        controls[key].valid = isArray
          ? data[key].map(val => validate(val, controls[key].validation))
          : validate(data[key], controls[key].validation)
        controls[key].touched = isArray
          ? data[key].map(_ => true)
          : true
      } else if (controls[key].type === 'ref' && data[key]) {
        controls[key].value = data[key]
      }
    })
    return controls
  }

  useEffect(async () => {
    try {
      const response = await request(`/api/people/${id}`)
      const controls = toStateData(response.data.data, state.controls)
      setState({ ...state, controls})
      setReady(true)
    } catch (error) {
      console.log(error);
    }
  }, [request])

  if (isLoading || !isReady) return <div>Loading...</div>

  return (
    <>
      <Toolbar disableGutters>
        <Button variant="contained" color="primary" disabled={!state.valid} onClick={saveHandler}>Сохранить</Button>
        <Button variant="contained" disabled={!state.valid} onClick={saveHandler.bind(null, true)}>Сохранить и закрыть</Button>
        <Button variant="contained" onClick={close}>Закрыть</Button>
      </Toolbar>
      {/* <Form form={state.controls} changeHandler={handler} remove={remove}/> */}
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
    </>
  )
}

export default Item
