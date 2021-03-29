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

export default function SelectRef({onSelect, value, options, label}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('')
  const [list, setList] = useState([]);
  const anchorRef = useRef(null)
  const { request, isLoading } = useHttp()

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    setOpen(false);
  };

  const search = (val) => {
    setOpen(true)
    setInput(val)
    request({
      url: `/api/${options.ref}?search=${val}`,
      method: 'GET',
    }).then(response => {
      console.log(response);
      setList(response.data.data);
    });
  }

  const select = (el) => {
    onSelect(el)
    handleClose()
  }

  useEffect(() => {
    if (value) {
      setList([value])
      setInput(value[options.inputValue])
    }
  }, [value])

  return (
    <>
      <TextField
        ref={anchorRef}
        label={label}
        value={input}
        variant="outlined"
        onClick={_ => setOpen(true)}
        onChange={e => search(e.target.value)}
      />
      <Popper open={open} style={{zIndex: 1000}} anchorEl={anchorRef.current} placement="bottom-start" disablePortal>
        <Paper style={{width: '500px'}}>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList /* autoFocusItem={open} */ id="menu-list-grow">
              {
                list.map(el => {
                  return (
                    <MenuItem key={el._id} onClick={e => select(el)}>{el[options.inputValue]}</MenuItem>
                  )
                })
              }
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </>
  )
}
