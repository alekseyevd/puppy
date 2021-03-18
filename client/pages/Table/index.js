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
  makeStyles,
  IconButton,
  Icon
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../../services/http'
import { useEffect, useState } from 'react'
import Item from '../Item'


export default function DataTable() {
  const history = useHistory()

  const { request, isLoading } = useHttp()

  const [users, setUsers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSelectAll = (event) => {
    let newUserCustomerIds;

    if (event.target.checked) {
      newUserCustomerIds = users.map((user) => user.id);
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

  const addUserToState = (user) => {
    const cloneUusers = JSON.parse(JSON.stringify(users))
    cloneUusers.unshift(user)
    setUsers(cloneUusers)
  }

  useEffect(async () => {
    try {
      const response = await request('/api/users')
      setUsers(response.data.data)
    } catch (error) {
      console.log(error.response)
    }
  }, [request])

  if (isLoading) return <div>loading...</div>

  return (
    <>
      <Container maxWidth={false} >
        <Typography>Пользователи</Typography>
        <Toolbar>
          <div>Всего документов: {users.length}</div>
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
                  />
                </TableCell>
                <TableCell align="left">
                  Логин
                </TableCell>
                <TableCell>
                  Роль
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  hover
                  key={user.id}
                  onClick={() => history.push(`/users/${user.id}`)}
                  selected={selectedUserIds.indexOf(user.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      value="true"
                      onClick={e => handleSelectOne(e, user.id)}
                      checked={selectedUserIds.indexOf(user.id) !== -1}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      color="textPrimary"
                      variant="body1"
                    >
                      {user.login}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {user.role}
                  </TableCell>
                  <TableCell style={{textAlign: 'right'}}>
                    <IconButton size="small" onClick={e=> e.stopPropagation()}>
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
        <Item close={handleClose} addUserToState={addUserToState} />
      </Dialog>
    </>
  );
}
