/* eslint-disable no-unused-vars */
import {
  TextField,
  Popper,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem
} from '@material-ui/core'
import { useState, useRef, useEffect } from 'react'
import { useHttp } from '../../services/http'

export default function SelectRef({onSelect, value, options, label, error}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('')
  const [list, setList] = useState([]);
  const anchorRef = useRef(null)
  const { request, isLoading } = useHttp()

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }

  const search = async (val) => {
    const url = val ? `/api/${options.ref}?search=${val}` : `/api/${options.ref}`
    setInput(val)
    try {
      const response = await request({
        url,
        method: 'GET',
      })
      const list = response.data.data
      setList(list)
      if (val) {
        const el = list.find(el => el[options.inputValue] === val)
        onSelect(el || {})
      } else {
        onSelect(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const select = (e, el) => {
    onSelect(el)
    handleClose(e)
  }

  useEffect(() => {
    if (value && value._id) {
      setList([value])
      setInput(value[options.inputValue])
    }
  }, [value])

  return (
    <>
      <TextField
        ref={anchorRef}
        error={error}
        label={label}
        value={input}
        variant="outlined"
        margin="normal"
        onClick={_ => setOpen(true)}
        onChange={e => search(e.target.value)}
      />
      <Popper open={open} style={{zIndex: 1000}} anchorEl={anchorRef.current} placement="bottom-start" disablePortal>
        <Paper style={{width: '500px'}}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList /* autoFocusItem={open} */ id="menu-list-grow">
              {
                list.length
                  ? list.map(el => {
                    return (
                      <MenuItem key={el._id} onClick={e => select(e, el)}>{el[options.inputValue]}</MenuItem>
                    )
                  })
                  : <MenuItem>Не найдено</MenuItem>
              }
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  )
}
