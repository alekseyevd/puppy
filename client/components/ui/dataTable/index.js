/* eslint-disable no-unused-vars */
import { useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableBody,
} from '@material-ui/core'

const DataTable = ({ columns, controls, data, limit, onRowClick, onSelect, selected }) => {
  // const [selectedIds, setSelectedIds] = useState([])

  const handleSelectAll = (event) => {
    let newSelectedIds
    if (event.target.checked) {
      newSelectedIds = data.map(row => row.id)
    } else {
      newSelectedIds = []
    }
    // setSelectedIds(newSelectedIds)
    onSelect(newSelectedIds)
  }

  const handleSelectOne = (event, id) => {
    event.stopPropagation()
    const selectedIndex = selected.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = newSelectedIds.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelectedIds = newSelectedIds.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelectedIds = newSelectedIds.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedIds = newSelectedIds.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
      )
    }
    // setSelectedIds(newSelectedIds)
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
                selected.length > 0
                && selected.length < data.length
              }
              checked={
                selected.length > 0
                && selected.length === data.length
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
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow
            hover
            key={row.id}
            onClick={() => onRowClick(row.id)}
            selected={selected.indexOf(row.id) !== -1}
          >
            <TableCell padding="checkbox">
              <Checkbox
                value="true"
                color="primary"
                onClick={e => handleSelectOne(e, row.id)}
                checked={selected.indexOf(row.id) !== -1}
              />
            </TableCell>
            {
              columns.map(th => {
                return (
                  <TableCell key={row.id+th.field}>
                    {
                      controls[th.field].type === 'ref'
                        ? row[th.field][controls[th.field].options.inputValue]
                        : row[th.field]
                    }
                  </TableCell>
                )
              })
            }
            {/* <TableCell style={{textAlign: 'right'}}>
              <IconButton size="small" onClick={(e) => moveTo(e, row.id, 'archive')}>
                <Icon fontSize="small">archive</Icon>
              </IconButton>
              <IconButton size="small" onClick={(e) => moveTo(e, row.id, 'trash')}>
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default DataTable
