/* eslint-disable no-unused-vars */
import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useHttp } from '../../services/http'
import { useEffect } from 'react';

export default function SelectRef({onSelect, value, options}) {
  const [open, setOpen] = React.useState(false);
  const [list, setList] = React.useState([]);
  const [filter, setFilter] = React.useState('');
  const { request, isLoading } = useHttp()
  const loading = open && isLoading;

  const search = (val) => {
    setFilter(val)
    request({
      url: `/api/${options.ref}?search=${val}`,
      method: 'GET',
    }).then(response => {
      console.log(response);
      setList(response.data.data);
    });
  }

  useEffect(() => {
    if (value) setList([value])
  }, [])

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.login === value.login}
      getOptionLabel={(option) => option.login}
      options={list}
      loading={loading}
      // inputValue={filter}
      value={value}
      // onInputChange={search}
      onChange={(e, v, r) => {
        if (v) {
          onSelect(v)
        } else {
          onSelect(null)
          setFilter('')
          // setOptions()
        }
      } }
      renderInput={(params) => (
        <TextField
          {...params}
          label="addedBy"
          onChange={e => search(e.target.value)}
          value={filter}
          variant="outlined"
          InputProps={{
            ...params.InputProps
          }}
        />
      )}
    />
  );
}
