/* eslint-disable no-unused-vars */
// import fetch from 'cross-fetch';
import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHttp } from '../../services/http'

export default function Asynchronous({selectHandler, user}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [value, setValue] = React.useState('');
  const { request, isLoading } = useHttp()
  const loading = open && isLoading;

  const search = useCallback(() => {
    let active = true;

    // if (!loading) {
    //   return undefined;
    // }

    request({
      url: `/api/people?&name=${value}`,
      method: 'GET',
    }).then(response => {
      console.log(response);
      // if (active) {
      setOptions(response.data.data);
      // }
    });

    return () => {
      active = false;
    };
  }, [loading, value])

  React.useEffect(() => {
    search()
  }, [value]);

  React.useEffect(() => {
    if (!open) {
      // setOptions([]);
      setValue('')
    }
  }, [open]);

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
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      value={user}
      onChange={(e, v, r) => {
        if (v) {
          selectHandler(v._id)
        } else selectHandler('')
      } }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          variant="outlined"
          onChange={e => setValue(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
