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
import formControls from './formControls'


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

  const [state, setState] = useState(formControls)

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
