import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Search from './Search';

const bookMockData = [
  {
    link: 'url',
    title: 'Alice in Wonderland',
    CFI: 'string',
    id: 8
  },
  {
    link: 'url',
    title: 'Pinocchio',
    CFI: 'string',
    id: 7
  },
  {
    link: 'url',
    title: 'Snow White and the Seven Dwarfs',
    CFI: 'string',
    id: 6
  },
  {
    link: 'url',
    title: 'Cinderella',
    CFI: 'string',
    id: 5
  },
  {
    link: 'url',
    title: 'Peter Pan',
    CFI: 'string',
    id: 4
  },
  {
    link: 'url',
    title: 'Tangled',
    CFI: 'string',
    id: 3
  },
  {
    link: 'url',
    title: 'Winnie the Pooh',
    CFI: 'string',
    id: 2
  },
  {
    link: 'url',
    title: 'Beauty and the Beast',
    CFI: 'string',
    id: 1
  },
  {
    link: 'url',
    title: 'Sleeping Beauty',
    CFI: 'string',
    id: 0
  }
];

const sortByTitle = (a, b) => {
  if (a.title > b.title) return 1;
  if (a.title < b.title) return -1;
  return 0;
};

const sortById = (a, b) => {
  if (a.id > b.id) return 1;
  if (a.id < b.id) return -1;
  return 0;
};

const Library = () => {
  const [books, setBooks] = useState(bookMockData.slice().reverse());
  const [displayBooks, setDisplayBooks] = useState(bookMockData.slice().reverse());
  const [titles, setTitles] = useState(bookMockData.map(book => book.title).sort());
  const [email, setEmail] = useState('t@t.com')
  const [sortOption, setSortOption] = useState('Recently added')

  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {
    if (sortOption === 'A-Z') {
      const sortedBooks = books.slice().sort(sortByTitle);
      const sortedDisplayBooks = displayBooks.slice().sort(sortByTitle);
      setBooks(sortedBooks);
      setDisplayBooks(sortedDisplayBooks);
    } else {
      const sortedBooks = books.slice().sort(sortById);
      const sortedDisplayBooks = displayBooks.slice().sort(sortById);
      setBooks(sortedBooks);
      setDisplayBooks(sortedDisplayBooks);
    }
  },[sortOption])

  const handleSearch = (searchedStr) => {
    const searchBook = books.filter(book => book.title.toLowerCase().indexOf(searchedStr) !== -1);
    setDisplayBooks(searchBook);
  };

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
  };

  const getUserData = () => {
    const params = {
      email: email
    };
    axios.get('/library', { params })
      .then(response => {
        const data = response.data.reverse();
        //expect data to be an array of book objects with 3 props: link, title, cfi
        console.log('This is data from get /library:', data);
        const orderedData = data.map((book, index) => {
          book.id = index;
          return book;
        })
        setBooks(orderedData);
        setDisplayBooks(orderedData);
        setTitles(orderedData.map(book => book.title).sort());
      })
      .catch(err => {
        console.log('Error from sending get request /library: ', err);
      });
  };

  const handleLogOut = () => {
    //change email stored in global context to ''
    //redirect to the landing page: history.push('/');
    console.log('To Do after setting up react context and router');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>BookBrother</h1>
        <Button
          style={{ height: '2rem' }}
          variant='contained'
          color='primary'
          type='button'
          onClick={handleLogOut}
        >
          Sign Out
        </Button>
      </div>
      <Search titles={titles} handleSearch={handleSearch} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
        <h2>My Library</h2>
        <FormControl sx={{ width: '15%', maxheight: '1rem'}}>
          <InputLabel id="sort">Sort</InputLabel>
          <Select
            labelId="sort"
            id="sort-select"
            label="Sort"
            value={sortOption}
            onChange={handleSortOptionChange}
          >
            <MenuItem value={'Recently added'}>Recently added</MenuItem>
            <MenuItem value={'A-Z'}>A-Z</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex', padding: '1rem 1rem', flexWrap: 'wrap' }}>
      {displayBooks.map(book => (
        <Card sx={{ maxWidth: '15rem', margin: '1rem' }}>
          <CardMedia
            component="img"
            width="30"
            image="/book-cover.png"
            alt="book cover"
            />
          <CardContent sx={{ height: '2.5rem' }}>
            <Typography gutterBottom variant='subtitle1' component="div" sx={{ textAlign: 'center', verticalAlign: 'middle', padding: 'auto' }}>
              {book.title}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button size='medium' >Play</Button>
            <Button size='medium' color='warning'>Remove</Button>
          </CardActions>
        </Card>
      ))}
      </div>
    </div>
  );
}

export default Library;