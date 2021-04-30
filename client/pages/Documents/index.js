/* eslint-disable no-unused-vars */
import { useHistory } from 'react-router-dom'
import { useHttp } from '../../services/http'
import { useEffect, useState } from 'react'
import {
  Card,
  Container,
  Typography,
  Toolbar,
  Button,
  Dialog
} from '@material-ui/core'
import AddItem from './Add'
import DataTable from '../../components/ui/dataTable'

const Documents = ({ entity, fields, controls }) => {
  const history = useHistory()

  const { request, isLoading } = useHttp()

  const [data, setData] = useState([])
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false)

  const handleOpenAddForm = () => {
    setOpen(true);
  }

  const handleCloseAddForm = () => {
    setOpen(false);
  }

  const addItemToState = (row) => {
    const cloned = JSON.parse(JSON.stringify(data))
    cloned.unshift(row)
    setData(cloned)
  }

  useEffect(async () => {
    try {
      const response = await request(`/api/${entity}`)
      console.log(response);
      setData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <>
      <Container maxWidth={false} >
        <Typography>{entity}</Typography>
        <Toolbar>
          <div>Всего документов: {data.length}</div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleOpenAddForm}
          >
            Добавить
          </Button>
        </Toolbar>
        <Card>
          <DataTable
            columns={fields}
            data={data}
            onRowClick={(id) => history.push(`/${entity}/${id}`)}
            onSelect={setSelectedIds}
          />
        </Card>
      </Container>
      <Dialog open={open} disableBackdropClick aria-labelledby="form-dialog-title">
        <AddItem close={handleCloseAddForm} addItemToState={addItemToState} controls={controls}/>
      </Dialog>
    </>
  )
}

export default Documents
