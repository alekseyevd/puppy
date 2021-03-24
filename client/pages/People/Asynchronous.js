/* eslint-disable no-unused-vars */
// import fetch from 'cross-fetch';
import React, { useCallback } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHttp } from '../../services/http'

export default function Asynchronous() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  const { request } = useHttp()

  const search = useCallback((data = {}) => {
    console.log(data);
    let active = true;

    // if (!loading) {
    //   return undefined;
    // }

    request({
      url: `/api/people?&filter=${JSON.stringify(data)}`,
      method: 'GET',
    }).then(response => {
      console.log(response);
      if (active) {
        setOptions(response.data.data);
      }
    });

    return () => {
      active = false;
    };
  }, [loading])

  React.useEffect(() => {
    search()
  }, [search]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
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
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          variant="outlined"
          onChange={e => search({ name: e.target.value })}
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
