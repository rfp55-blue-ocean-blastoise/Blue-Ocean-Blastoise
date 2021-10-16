import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';

const Search = (props) => {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (event, value) => {
    setSearchValue(value);
  };

  const handleSearch = () => {
    props.handleSearch(searchValue);
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', margin: '2rem 0 2rem 0' }}>
      <Autocomplete
        id='book-search'
        sx={{ width: '80%', mr: '1em' }}
        options={props.titles}
        autoHighlight
        getOptionLabel={(option) => option}
        onChange={handleChange}
        renderOption={(props, option) => (
          <Box component='li' sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            {option}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label='Search'
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
            required
          />
        )}
      />
      <Button variant='contained' color='primary' type='button' onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
}

export default Search;