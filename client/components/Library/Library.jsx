import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route, Link, useHistory } from 'react-router-dom';
import { GlobalContext } from "../GlobalContextProvider";
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
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import Search from './Search';
import Upload from './Upload';
import Epub from 'epubjs/lib/index';

const Library = (props) => {
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const { value, setValue } = useContext(GlobalContext);

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
        if (lowerInput === 'recent' || lowerInput === 'title') {
          setSortOption(lowerInput);
        } else {
          voiceCommandError = <p>Sort option not found</p>;
        }
      }
    }
  ];

  const { transcript } = useSpeechRecognition({ commands });

  if (!SpeechRecognition.browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  };

  useEffect(() => {
    getBookLibrary();
  }, [])

  useEffect(() => {
    if (sortOption === 'title') {
      const sortedBooks = books.slice().sort(sortByTitle);
      const sortedDisplayBooks = displayBooks.slice().sort(sortByTitle);
      setBooks(sortedBooks);
      setDisplayBooks(sortedDisplayBooks);
    } else if (sortOption === 'recent') {
      const sortedBooks = books.slice().sort(sortById);
      const sortedDisplayBooks = displayBooks.slice().sort(sortById);
      setBooks(sortedBooks);
      setDisplayBooks(sortedDisplayBooks);
    }
  },[sortOption])

  const handleSearch = (searchedStr) => {
    const searchBooks = books.filter(book => book.title.toLowerCase().indexOf(searchedStr) !== -1);
    setDisplayBooks(searchBooks);
  };

  const handleSortOptionChange = (e) => {
    setSortOption(e.target.value);
  };

  const getBookLibrary = () => {
    axios.get('/library')
      .then(response => {
        const data = response.data.reverse();
        //expect data to be an array of book objects with 5 props: Key, Etag, size, URL
        console.log('This is data from get /library:', data);
        const orderedData = data.map((book, index) => {
          let currBook = new Epub(book.URL);
          currBook.ready.then(() => {
            currBook.coverUrl()
            .then((results) => {
              if(results) {
                document.getElementById(book.URL).src = results;
                book.coverURL = results;
              } else {
                document.getElementById(book.URL).src = '/book-cover.png';
                book.coverURL = '/book-cover.png';
              }
            })
            .catch((err) => console.error(err));
          });
          book.title = book.Key.slice(0, book.Key.length - 5);
          book.id = index;
          return book;
        })
        setBooks(orderedData);
        setDisplayBooks(orderedData);
      })
      .catch(err => {
        console.log('Error from sending get request /library: ', err);
      });
  };

  const handleLogOut = () => {
    setValue('');
    history.push('/');
  };

  const handleAddBook = (book) => {
    console.log('BODY FOR REQ: ', value, book.URL, book.title);
    axios.post('/account/library', {
      email: value,
      link: book.URL,
      title: book.title
    })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      })
  };

  return (
    <div>
      <div className='banner' style={{ display: 'flex', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginRight: '70%' }} > BookBrother</h1>
        <Button
          style={{ height: '2rem', backgroundColor: '#0c6057' }}
          variant='contained'
          type='button'
          onClick={handleLogOut}
        >
          Sign Out
        </Button>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Search handleSearch={handleSearch} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <Button
          variant='contained'
          style={{ backgroundColor: '#11A797' }}
          type='button'
          onClick={SpeechRecognition.startListening}
        >
          <SettingsVoiceIcon />
        </Button>
        <p id="transcript">Transcript: {transcript}</p>
      </div>
      {voiceCommandError}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem' }}>
        <h1>Library</h1>
        <FormControl sx={{ width: '10%', maxheight: '1rem'}}>
          <InputLabel id='sort'>Sort</InputLabel>
          <Select
            labelId='sort'
            id='sort-select'
            label='Sort'
            value={sortOption}
            onChange={handleSortOptionChange}
            >
            <MenuItem value={'recent'}>Recent</MenuItem>
            <MenuItem value={'title'}>Title</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ display: 'flex', padding: '2rem 4rem', flexWrap: 'wrap' }}>
        {displayBooks.filter(book => book.remainingText !== '').length === 0 ?
          <p style={{margin: '1rem', fontSize: '1.2rem'}}>No Books</p>
          : displayBooks.filter(book => book.remainingText !== '').map(book => (
          <Card sx={{ width: '15rem', margin: '1rem', height: '25rem' }}>
            <img id={book.URL} src={book.coverURL} style={{ width: '100%', height: '70%'}} />
            <CardContent sx={{ height: '2.5rem' }}>
              <Typography gutterBottom variant='subtitle1' component='div' sx={{ textAlign: 'center', verticalAlign: 'middle', padding: 'auto' }}>
                {book.title}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button size='medium' style={{ color:'#0c6057' }} value={JSON.stringify(book)} onClick={e => handleAddBook(JSON.parse(e.target.value))}>Add to My Books</Button>
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

export default Library;
