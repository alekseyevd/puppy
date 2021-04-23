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
import { useForm } from '../../services/useForm';
import controls from './controls';


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

  const form = useForm({
    initial: controls,
    onSubmit: async (data) => {
      try {
        const res = await request({
          url: '/api/people',
          method: 'POST',
          data
        })
        addItemToState(res.data.data)
        close()
      } catch (error) {
        console.log(error);
      }
    }
  })

  return (
    <>
      <DialogTitle id="form-dialog-title">Новый физ лицо</DialogTitle>
      <DialogContent className={styles.root}>
        {/* <DialogContentText>
          To subscribe to this website, please enter your email address here. We will send updates
          occasionally.
        </DialogContentText> */}
        {
          Object.keys(form.state.controls).map(name => {
            const props = form.state.controls[name]
            return (
              <div key={name}>
                <Control name={name} {...props} onChange={form.handleChange} onRemove={form.handleRemove} />
              </div>
            )
          })
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={() => confirm('Вы уверены?') ? close() : null} variant="contained">
          Отменить
        </Button>
        <Button onClick={form.handleSubmit} color="primary" variant="contained" disabled={!form.state.valid}>
          Сохранить
        </Button>
      </DialogActions>
    </>
  )
}

export default AddItem
