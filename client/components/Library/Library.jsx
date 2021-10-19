import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link, useHistory } from 'react-router-dom';
import regeneratorRuntime from "regenerator-runtime";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
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
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import Search from './Search';
import Player from './Player';

const Library = (props) => {
  const [books, setBooks] = useState(bookMockData.slice().reverse());
  const [displayBooks, setDisplayBooks] = useState(bookMockData.slice().reverse());
  const [titles, setTitles] = useState(bookMockData.map(book => book.title).sort());
  const [email, setEmail] = useState('t@t.com')
  const [sortOption, setSortOption] = useState('recently added')
  const history = useHistory();

  let voiceCommandError = '';

  const commands = [
    {
      command: ['Search *'],
      callback: (input) => {
        handleSearch(input.toLowerCase());
      }
    },
    {
      command: ['Clear Search'],
      callback: (input) => {
        handleSearch('');
      }
    },
    {
      command: ['Sort by *'],
      callback: (input) => {
        const lowerInput = input.toLowerCase();
        if (lowerInput === 'recently added' || lowerInput === 'a-to-z') {
          setSortOption(lowerInput);
        } else {
          voiceCommandError = <p>Sort option not found</p>;
        }
      }
    },
    {
      command: ['Play *'],
      callback: (input) => {
        console.log('THIS IS INPUT: ', input);
        let bookLink = '';
        for (var i = 0; i < books.length; i++) {
          if (books[i].title.toLowerCase() === input.toLowerCase()) {
            bookLink = books[i].link;
            break;
          }
        }
        console.log('THIS IS BOOKLINK: ', bookLink);
        if (bookLink.length) {
          handlePlayBook(bookLink);
        } else {
          voiceCommandError = <p>Could not find book with title: {input}</p>;
        }
      }
    }
  ];

  const { transcript } = useSpeechRecognition({ commands });

  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  };

  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {
    if (sortOption === 'a-to-z') {
      const sortedBooks = books.slice().sort(sortByTitle);
      const sortedDisplayBooks = displayBooks.slice().sort(sortByTitle);
      setBooks(sortedBooks);
      setDisplayBooks(sortedDisplayBooks);
    } else if (sortOption === 'recently added') {
      const sortedBooks = books.slice().sort(sortById);
      const sortedDisplayBooks = displayBooks.slice().sort(sortById);
      setBooks(sortedBooks);
      setDisplayBooks(sortedDisplayBooks);
    }
  },[sortOption])

  const handlePlayBook = (bookLink) => {
    props.handlePlayBook(bookLink);
    history.push('/player');
  };

  const handleRemoveBook = (e) => {
    console.log('TO DO handle remove', e.target.value);
    /*
    axios.put('', { email })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log('Error sending put request to remove book: ', err);
    });
    */
  };

  const handleSearch = (searchedStr) => {
    const searchBooks = books.filter(book => book.title.toLowerCase().indexOf(searchedStr) !== -1);
    setDisplayBooks(searchBooks);
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
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <Button variant='contained' color='primary' type='button' onClick={SpeechRecognition.startListening}>
          <SettingsVoiceIcon />
        </Button>
        <p id="transcript" style={{marginLeft: '2rem'}}>Transcript: {transcript}</p>
      </div>
      {voiceCommandError}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
        <h2>My Library</h2>
        <FormControl sx={{ width: '15%', maxheight: '1rem'}}>
          <InputLabel id='sort'>Sort</InputLabel>
          <Select
            labelId='sort'
            id='sort-select'
            label='Sort'
            value={sortOption}
            onChange={handleSortOptionChange}
          >
            <MenuItem value={'recently added'}>Recently added</MenuItem>
            <MenuItem value={'a-to-z'}>A-Z</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex', padding: '1rem 1rem', flexWrap: 'wrap' }}>
      {displayBooks.length === 0 ?
        <p style={{margin: '1rem', fontSize: '1.2rem'}}>No results found</p>
        : displayBooks.map(book => (
        <Card sx={{ maxWidth: '15rem', margin: '1rem' }}>
          <CardMedia
            component='img'
            width='30'
            image='/book-cover.png'
            alt='book cover'
            />
          <CardContent sx={{ height: '2.5rem' }}>
            <Typography gutterBottom variant='subtitle1' component='div' sx={{ textAlign: 'center', verticalAlign: 'middle', padding: 'auto' }}>
              {book.title}
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button size='medium' value={book.link} onClick={e => handlePlayBook(e.target.value)}>Play</Button>
            <Button size='medium' value={book.link} color='warning' onClick={handleRemoveBook}>Remove</Button>
          </CardActions>
        </Card>
      ))}
      </div>
    </div>
  );
};

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

const bookMockData = [
  {
    link: 'url Alice in Wonderland',
    title: 'Alice in Wonderland',
    CFI: 'string',
    id: 8
  },
  {
    link: 'url Pinocchio',
    title: 'Pinocchio',
    CFI: 'string',
    id: 7
  },
  {
    link: 'url Snow White and the Seven Dwarfs',
    title: 'Snow White and the Seven Dwarfs',
    CFI: 'string',
    id: 6
  },
  {
    link: 'url Cinderella',
    title: 'Cinderella',
    CFI: 'string',
    id: 5
  },
  {
    link: 'url Peter Pan',
    title: 'Peter Pan',
    CFI: 'string',
    id: 4
  },
  {
    link: 'url Tangled',
    title: 'Tangled',
    CFI: 'string',
    id: 3
  },
  {
    link: 'url Winnie the Pooh',
    title: 'Winnie the Pooh',
    CFI: 'string',
    id: 2
  },
  {
    link: 'url Beauty and the Beast',
    title: 'Beauty and the Beast',
    CFI: 'string',
    id: 1
  },
  {
    link: 'url Sleeping Beauty',
    title: 'Sleeping Beauty',
    CFI: 'string',
    id: 0
  }
];

export default Library;