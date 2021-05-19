/* eslint-disable no-unused-vars */
import {
  makeStyles,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { useHttp } from '../../services/http'
import Control from '../../components/ui/inputs'
import { useForm } from '../../services/useForm'
import { useState } from 'react'

const useStyles = makeStyles((theme) => ({
  root: {
    'width': '600px',
    '& .MuiTextField-root': {
      marginTop: '10px',
    },
    '& .MuiFormControl-root': {
      marginTop: '10px',
      width: '100%'
    }
  },
}));

const AddItem = ({entity, close, addItemToState, controls}) => {
  const styles = useStyles()
  const { request, isLoading } = useHttp()
  const [error, setError] = useState('')

  const form = useForm({
    initial: controls,
    onSubmit: async (data) => {
      try {
        const res = await request({
          url: `/api/${entity}`,
          method: 'POST',
          data
        })
        addItemToState(res.data.data)
        close()
      } catch (error) {
        console.log(error.response);
        setError(error.response.data.message)
      }
    }
  })

  return (
    <>
      <DialogTitle id="form-dialog-title">Новая запись</DialogTitle>
      <DialogContent className={styles.root}>
        { error && <DialogContentText>
          <Alert severity="error">{error}</Alert>
        </DialogContentText> }
        <div>
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
        </div>
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
