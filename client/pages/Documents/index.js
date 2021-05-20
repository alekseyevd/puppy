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
import Alert from '@material-ui/lab/Alert'
import TablePagination from '@material-ui/core/TablePagination';
import Document from './Document'
import AddItem from './Add'
import DataTable from '../../components/ui/dataTable'
import config from '../../config'

const Documents = ({ entity }) => {
  const history = useHistory()
  const { id } = useParams()

  if (id && id !== 'trash' && id !== 'archive') {
    return <Document entity={entity} controls={config[entity].controls} />
  }

  const status = id === 'trash' ? 3 : id === 'archive' ? 2 : 1


  const { request, isLoading } = useHttp()

  // const [data, setData] = useState([])
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [limit, setlimit] = useState(5)
  const [count, setCount] = useState(0)
  const [error, setError] = useState('')
  // const [fields, setFields] = useState([])
  // const [controls, setControls] = useState({})

  const [pageState, setPageState] = useState({
    data: [],
    fields: [],
    columns: {}
  })

  const handleOpenAddForm = () => {
    setOpen(true);
  }

  const handleCloseAddForm = () => {
    setOpen(false);
  }

  const addItemToState = (row) => {
    const cloned = JSON.parse(JSON.stringify(pageState))
    cloned.data.unshift(row)
    setPageState(cloned)
  }

  const handleChangePage = async (_, newPage) => {
    // setPage(newPage)
    updateData({ limit, page: newPage})
  }

  const handleChangeRowsPerPage = (event) => {
    // setlimit(event.target.value)
    updateData({ limit: event.target.value, page})
  };

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

  const updateData = useCallback(async (params = {}) => {
    const itemsPerPage = params.limit || limit
    const page = params.page || 0
    try {
      const response = await request(`/api/${entity}?status=${status}&limit=${itemsPerPage}&page=${page}`)
      // setData(response.data.data)
      setCount(+response.headers['pagination-count'] || 0)
      setlimit(itemsPerPage)
      setPage(page)
      // setControls(config[entity].controls)
      // setFields(config[entity].columns)
      setPageState({
        data: response.data.data,
        fields: config[entity].columns,
        controls: config[entity].controls
      })
      console.log(response)
    } catch (error) {
      console.log(error)
      setError(error.response.data.message)
    }
  }, [entity, status])

  useEffect(() => {
    updateData()
  }, [updateData])

  if (isLoading) return <div>loading</div>

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
            { selectedIds.length ? `Выбрано документов: ${selectedIds.length}` : `Всего документов: ${count}` }
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
        { error && <Alert severity="error">{error}</Alert> }
        <Card>
          <DataTable
            columns={pageState.fields}
            controls={pageState.controls}
            data={pageState.data}
            selected={selectedIds}
            onRowClick={(id) => history.push(`/${entity}/${id}`)}
            onSelect={setSelectedIds}
          />
          <TablePagination
            component="div"
            count={count}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 15, 30]}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Card>
        <Link to={`/${entity}`}>Активные</Link>
        <Link to={`/${entity}/trash`}>Удаленные</Link>
        <Link to={`/${entity}/archive`}>В архиве</Link>
      </Container>
      <Dialog open={open} maxWidth="md" disableBackdropClick aria-labelledby="form-dialog-title">
        <AddItem entity={entity} close={handleCloseAddForm} addItemToState={addItemToState} controls={config[entity].controls}/>
      </Dialog>
    </>
  )
}

export default Documents
