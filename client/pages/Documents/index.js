/* eslint-disable no-unused-vars */
import { useHistory, useParams, useLocation, Link } from 'react-router-dom'
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
import TablePagination from '@material-ui/core/TablePagination';
import Document from './Document'
import AddItem from './Add'
import DataTable from '../../components/ui/dataTable'

const Documents = ({ entity, fields, controls }) => {
  const history = useHistory()
  const { id } = useParams()

  if (id && id !== 'trash' && id !== 'archive') {
    return <Document entity={entity} controls={controls} />
  }

  const status = id === 'trash' ? 3 : id === 'archive' ? 2 : 1


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

  const moveTo = async (where) => {
    try {
      const res = await request({
        url: `/api/${entity}/moveto/${where}`,
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
      const response = await request(`/api/${entity}?status=${status}`)
      setData(response.data.data)
      console.log(response.data.data);
    } catch (error) {
      console.log(error)
    }
  }, [entity, id])

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
                // onClick={handleClickDelete}
                onClick={() => moveTo('trash')}
              >
                Удалить
              </Button>
              {
                id !== 'archive'
                && <Button
                  variant="contained"
                  color="primary"
                  onClick={() => moveTo('archive')}
                >
                В архив
                </Button>
              }
              {
                (id === 'trash' || id === 'archive')
                && <Button
                  variant="contained"
                  color="primary"
                  onClick={() => moveTo('active')}
                >
                  Восстановить
                </Button>
              }
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
          <Link to={`/${entity}`}>Активные</Link>
          <Link to={`/${entity}/trash`}>Удаленные</Link>
          <Link to={`/${entity}/archive`}>В архиве</Link>
          <TablePagination
            component="div"
            count={100}
            page={0}
            // onChangePage={handleChangePage}
            rowsPerPage={10}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
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
