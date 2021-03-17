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
  makeStyles
} from '@material-ui/core';
import data from './data'
import { useHistory } from 'react-router-dom'


export default function DataTable() {
  const history = useHistory()
  return (
    <Container maxWidth={false} >
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                />
              </TableCell>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Email
              </TableCell>
              <TableCell>
                Location
              </TableCell>
              <TableCell>
                Phone
              </TableCell>
              <TableCell>
                Registration date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customer) => (
              <TableRow
                hover
                key={customer.id}
                style={{position: 'relative'}}
                onClick={() => history.push(`/users/${customer.id}`)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    value="true"
                    onClick={e => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    color="textPrimary"
                    variant="body1"
                  >
                    {customer.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {customer.email}
                </TableCell>
                <TableCell>
                  {`${customer.address.city}, ${customer.address.state}, ${customer.address.country}`}
                </TableCell>
                <TableCell>
                  {customer.phone}
                </TableCell>
                <TableCell>
                  {customer.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Container>
  );
}
