/* eslint-disable no-unused-vars */
import {
  Card,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  Typography,
  Toolbar,
  Button,
  Dialog,
  IconButton,
  Icon
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../../services/http'
import { useEffect, useState } from 'react'
import AddItem from './AddItem'
import tableConfig from './tableConfig'
import DataTable from '../../components/ui/dataTable'


export default function PeopleTablePage() {
  const history = useHistory()

  const { request, isLoading } = useHttp()

  const [data, setData] = useState([])
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }


  const addItemToState = (row) => {
    const cloned = JSON.parse(JSON.stringify(data))
    cloned.unshift(row)
    setData(cloned)
  }

  const moveTo = async (e, id, to) => {
    e.stopPropagation()
    try {
      const response = await request({
        url: `/api/people/${id}`,
        method: 'POST',
        data: {
          status: to === 'trash' ? 3 : 2
        }
      })
      // console.log(response)
      const newData = JSON.parse(JSON.stringify(data))
          .filter(user => user.id !== id)
      const newSelectedIds = JSON.parse(JSON.stringify(selectedIds))
          .filter(selectedId => selectedId !== id)
      setData(newData)
      setSelectedIds(newSelectedIds)
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(async () => {
    try {
      const response = await request('/api/people')
      console.log(response);
      setData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [])

  if (isLoading) return <div>loading...</div>

  return (
    <>
      <Container maxWidth={false} >
        <Typography>Физлица</Typography>
        <Toolbar>
          <div>Всего документов: {data.length}</div>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleClickOpen}
          >
            Добавить
          </Button>
        </Toolbar>
        <Card>
          <DataTable
            columns={tableConfig}
            data={data}
            onRowClick={(id) => history.push(`/people/${id}`)}
            onSelect={setSelectedIds}
          />
        </Card>
      </Container>
      <Dialog open={open} disableBackdropClick aria-labelledby="form-dialog-title">
        <AddItem close={handleClose} addItemToState={addItemToState} />
      </Dialog>
    </>
  )
}
