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

  const handleSelectAll = (event) => {
    let newSelectedIds;

    if (event.target.checked) {
      newSelectedIds = data.map(row => row.id);
    } else {
      newSelectedIds = [];
    }

    setSelectedIds(newSelectedIds);
  }

  const handleSelectOne = (event, id) => {
    event.stopPropagation()
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = newSelectedIds.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedIds = newSelectedIds.concat(
          selectedIds.slice(0, selectedIndex),
          selectedIds.slice(selectedIndex + 1)
      )
    }
    setSelectedIds(newSelectedIds)
  };

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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    onChange={handleSelectAll}
                    indeterminate={
                      selectedIds.length > 0
                      && selectedIds.length < data.length
                    }
                  />
                </TableCell>
                <TableCell align="left">
                  Имя
                </TableCell>
                <TableCell>
                  Фамилия
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  onClick={() => history.push(`/people/${row.id}`)}
                  selected={selectedIds.indexOf(row.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      value="true"
                      color="primary"
                      onClick={e => handleSelectOne(e, row.id)}
                      checked={selectedIds.indexOf(row.id) !== -1}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="body1"
                    >
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {row.surname}
                  </TableCell>
                  <TableCell style={{textAlign: 'right'}}>
                    <IconButton size="small" onClick={(e) => moveTo(e, row.id, 'archive')}>
                      <Icon fontSize="small">archive</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={(e) => moveTo(e, row.id, 'trash')}>
                      <Icon fontSize="small">delete</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </Container>
      <Dialog open={open} disableBackdropClick aria-labelledby="form-dialog-title">
        <AddItem close={handleClose} addItemToState={addItemToState} />
      </Dialog>
    </>
  );
}
