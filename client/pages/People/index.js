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
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [open, setOpen] = useState(true)

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSelectAll = (event) => {
    let newUserCustomerIds;

    if (event.target.checked) {
      newUserCustomerIds = data.map(row => row.id);
    } else {
      newUserCustomerIds = [];
    }

    setSelectedUserIds(newUserCustomerIds);
  }

  const handleSelectOne = (event, id) => {
    event.stopPropagation()
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelectedUserIds = [];

    if (selectedIndex === -1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelectedUserIds = newSelectedUserIds.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUserIds = newSelectedUserIds.concat(
          selectedUserIds.slice(0, selectedIndex),
          selectedUserIds.slice(selectedIndex + 1)
      )
    }
    setSelectedUserIds(newSelectedUserIds)
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
      const newSelectedUserIds = JSON.parse(JSON.stringify(selectedUserIds))
          .filter(selectedId => selectedId !== id)
      setData(newData)
      setSelectedUserIds(newSelectedUserIds)
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(async () => {
    try {
      const response = await request('/api/people')
      console.log(response.data);
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
                      selectedUserIds.length > 0
                      && selectedUserIds.length < data.length
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
                  selected={selectedUserIds.indexOf(row.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      value="true"
                      color="primary"
                      onClick={e => handleSelectOne(e, row.id)}
                      checked={selectedUserIds.indexOf(row.id) !== -1}
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
