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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import Search from './Search';
import Upload from './Upload';
import Epub from 'epubjs/lib/index';

const Library = (props) => {
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const [openRemove, setOpenRemove] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [removeBook, setRemoveBook] = useState({});
  const { value, setValue, signUserOut } = useContext(GlobalContext);
  let urls = ["https://s3.amazonaws.com/moby-dick/OPS/package.opf", "https://blueocean.s3.us-west-1.amazonaws.com/accessible_epub_3+(1).epub"];

  const history = useHistory();
  const [tab, setTab] = useState('Library');

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
  }, [sortOption])

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
        console.log(orderedData)
        setBooks(orderedData);
        setDisplayBooks(orderedData);
      })
      .catch(err => {
        console.log('Error from sending get request /library: ', err);
      });
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

  const handleLogOut = () => {
    signUserOut()
    history.push('/login');
  };

  return (
    <div>
      <div className='banner' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
        <h1 style={{ fontSize: '7vw', marginLeft: '5%' }} > BookBrother</h1>
        <Button
          style={{ height: '2rem', backgroundColor: '#0c6057', marginRight: '5%', fontSize: '80%', width: 'fit-content', padding: 'auto' }}
          size='small'
          variant='contained'
          type='button'
          onClick={handleLogOut}
        >
          Sign Out
        </Button>
      </div>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          textColor='inherit'
          TabIndicatorProps={{ style: {
            background: 'linear-gradient(61deg, rgba(201,221,148,1) 0%, rgba(143,198,144,1) 25%, rgba(109,184,141,1) 51%, rgba(143,198,144,1) 81%, rgba(201,221,148,1) 100%)',
            height: '5px'
          }}}
          aria-label="secondary tabs example"
          centered
        >
          <Tab label='My Account' value='My Account' sx={{ fontWeight: 'bold', fontSize: '2vh' }} component={Link} to={'/home'}/>
          <Tab label='Library' value='Library' sx={{ fontWeight: 'bold', fontSize: '2vh' }}  component={Link} to={'/freelibrary'}/>
        </Tabs>
      </Box>
      <div style={{display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Search handleSearch={handleSearch} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Button
          variant='contained'
          sx={{ backgroundColor: '#11A797' }}
          size='small'
          type='button'
          onClick={SpeechRecognition.startListening}
        >
          <SettingsVoiceIcon />
        </Button>
        <p id="transcript" style={{ fontSize: '2vh' }}>Transcript: {transcript}</p>
      </div>
      <img id={urls[0]} src="" style={{ width: '10%' }} />
      <img id={urls[1]} src="" style={{ width: '10%' }} />
      {voiceCommandError}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '2rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '3vh' }} >Library</h1>
        <FormControl sx={{ width: '10%', minWidth: '7rem', height: '1vw', minheight: '5px', marginRight: '1rem' }}>
          <InputLabel id='sort'>Sort</InputLabel>
          <Select
            labelId='sort'
            id='sort-select'
            label='Sort'
            style={{ fontSize: '2vh' }}
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
            <img id={book.URL} src={book.coverURL} style={{ width: '100%', height: '65%'}} />
            <CardContent sx={{ height: '4rem' }}>
              <Typography gutterBottom variant='subtitle1' component='div' sx={{ textAlign: 'center', verticalAlign: 'middle', padding: 'auto', fontSize: '2vh' }}>
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
  if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  return 0;
};

const sortById = (a, b) => {
  if (a.id > b.id) return 1;
  if (a.id < b.id) return -1;
  return 0;
};

export default Library;
