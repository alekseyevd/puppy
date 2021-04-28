/* eslint-disable no-unused-vars */
import { useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
  IconButton,
  Icon
} from '@material-ui/core'

const DataTable = ({ columns, data, limit, onRowClick, onSelect }) => {
  const [selectedIds, setSelectedIds] = useState([])

  const handleSelectAll = (event) => {
    let newSelectedIds
    if (event.target.checked) {
      newSelectedIds = data.map(row => row.id)
    } else {
      newSelectedIds = []
    }
    setSelectedIds(newSelectedIds)
    onSelect(newSelectedIds)
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
    onSelect(newSelectedIds)
  }

  const moveTo = () => {}

  return (
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
          {
            columns.map(th => {
              return (
                <TableCell key={th.field}>
                  {th.header}
                </TableCell>
              )
            })
          }
          <TableCell/>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow
            hover
            key={row.id}
            onClick={() => onRowClick(row.id)}
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
            {
              columns.map(th => {
                return (
                  <TableCell key={row.id+th.field}>
                    {row[th.field]}
                  </TableCell>
                )
              })
            }
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
  )
}

export default DataTable
