/* eslint-disable no-unused-vars */
// import fetch from 'cross-fetch';
import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHttp } from '../../services/http'
import { useEffect } from 'react';

export default function Asynchronous({selectHandler, value}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [filter, setFilter] = React.useState('');
  const { request, isLoading } = useHttp()
  const loading = open && isLoading;

  const search = (val) => {
    setFilter(val)
    request({
      url: `/api/users?&login=${val}`,
      method: 'GET',
    }).then(response => {
      console.log(response);
      setOptions(response.data.data);
    });
  }

  useEffect(() => {
    if (value) setOptions([value])
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
      options={options}
      loading={loading}
      // inputValue={filter}
      value={value}
      // onInputChange={search}
      onChange={(e, v, r) => {
        if (v) {
          selectHandler(v)
        } else {
          selectHandler(null)
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
