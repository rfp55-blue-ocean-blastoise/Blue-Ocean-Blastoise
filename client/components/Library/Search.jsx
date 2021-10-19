import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const Search = (props) => {
  const [searchValue, setSearchValue] = useState('');

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    props.handleSearch(e.target.value.toLowerCase());
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', margin: '2rem 0 2rem 0' }}>
      <TextField sx={{width: '60%'}} id="search" label="Search" type="search" value={searchValue} onChange={handleChange} InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }} />
    </div>
  );
}

export default Search;