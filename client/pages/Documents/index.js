/* eslint-disable no-unused-vars */
import { useHistory, useLocation } from 'react-router-dom'
import { useHttp } from '../../services/http'
import { useCallback, useEffect, useState } from 'react'
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
  // const params = useLocation()
  // console.log(params);

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

  const handleClickDelete = async () => {
    // console.log(selectedIds)
    try {
      const res = await request({
        url: `/api/${entity}/totrash`,
        method: 'PUT',
        data: selectedIds
      })
      await updateData()
      setSelectedIds([])
    } catch (error) {
      console.log(error);
    }
  }

  const updateData = useCallback(async () => {
    try {
      const response = await request(`/api/${entity}`)
      setData(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }, [entity])

  useEffect(() => {
    updateData()
  }, [updateData])

  return (
    <>
      <Container maxWidth={false} >
        <Typography>
          {entity}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOpenAddForm}
        >
          Новая запись
        </Button>
        <Toolbar>
          <div>
            { selectedIds.length ? `Выбрано документов: ${selectedIds.length}` : `Всего документов: ${data.length}` }
          </div>
          { selectedIds.length > 0 &&
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickDelete}
              >
                Удалить
              </Button>
              <Button
                variant="contained"
                color="primary"
              >
                В архив
              </Button>
            </>
          }
        </Toolbar>
        <Card>
          <DataTable
            columns={fields}
            data={data}
            selected={selectedIds}
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
