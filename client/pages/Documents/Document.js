/* eslint-disable no-unused-vars */
import { useParams, useHistory } from 'react-router-dom'
import {
  Toolbar,
  Button,
} from '@material-ui/core'
import { useState, useEffect } from 'react'
import { useHttp } from '../../services/http'
import Control from '../../components/ui/inputs'
import { useForm } from '../../services/useForm'

const Item = ({ entity, controls }) => {
  const { request, isLoading } = useHttp()
  const id = useParams().id
  const history = useHistory()

  const [isReady, setReady] = useState(false)

  const form = useForm({
    initial: controls,
    onSubmit: async (data, closeHandler) => {
      try {
        const res = await request({
          url: `/api/${entity}/${id}`,
          method: 'POST',
          data
        })
        if (closeHandler) closeHandler()
      } catch (error) {
        console.log(error)
      }
    }
  })

  const close = () => {
    history.push(`/${entity}`)
  }

  useEffect(async () => {
    try {
      const response = await request(`/api/${entity}/${id}`)
      console.log(response);
      form.toStateData(response.data.data)
      setReady(true)
    } catch (error) {
      console.log(error);
    }
  }, [request, entity, controls])

  if (isLoading || !isReady) return <div>Loading...</div>

  return (
    <>
      <Toolbar disableGutters>
        <Button variant="contained" color="primary" disabled={!form.state.valid} onClick={form.handleSubmit}>Сохранить</Button>
        <Button variant="contained" disabled={!form.state.valid} onClick={() => form.handleSubmit(null, close)}>Сохранить и закрыть</Button>
        <Button variant="contained" onClick={close}>Закрыть</Button>
      </Toolbar>
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
    </>
  )
}

export default Item
