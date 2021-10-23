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
import ModalUnstyled from '@mui/core/ModalUnstyled';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import Search from './Search';
import Player from '../Player/Player';
import Upload from './Upload';
import Epub from 'epubjs/lib/index';
import FileUploadIcon from '@mui/icons-material/FileUpload';

const MyAccount = (props) => {
  // const [books, setBooks] = useState(bookMockData.slice().reverse());
  // const [displayBooks, setDisplayBooks] = useState(bookMockData.slice().reverse());
  const [books, setBooks] = useState([]);
  const [displayBooks, setDisplayBooks] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const [openRemove, setOpenRemove] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [removeBook, setRemoveBook] = useState({});
  const { value, setValue, signUserOut } = useContext(GlobalContext);
  const [tab, setTab] = useState('My Account');

  const history = useHistory();

  let voiceCommandError = '';

  props.highlightBookRef.current = null;

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
    },
    {
      command: ['Play *'],
      callback: (input) => {
        let book = {};
        for (var i = 0; i < books.length; i++) {
          if (books[i].title.toLowerCase().indexOf(input.toLowerCase()) !== -1) {
            book = books[i];
            break;
          }
        }
        if (Object.keys(book).length) {
          console.log('THIS IS BOOK: ', book);
          handleReadBook(book);
        } else {
          voiceCommandError = <p>{`Can't find book with title: ${input}. Please try again`}</p>;
        }
      }
    },
    {
      command: ['Remove *'],
      callback: (input) => {
        let bookId = '';
        for (var i = 0; i < books.length; i++) {
          if (books[i].title.toLowerCase() === input.toLowerCase()) {
            bookId = books[i]['_id'];
            break;
          }
        }
        console.log('THIS IS BOOK ID: ', bookId);
        if (bookId.length) {
          handleRemoveBook(bookId);
        } else {
          voiceCommandError = <p>{`Can't find book with title: ${input}. Please try again`}</p>;
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
  }, [value])

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

  const handleCloseUpload = () => setOpenUpload(false);

  const handleReadBook = (book) => {
    props.handleReadBook(book);
    history.push('/player');
  };

  const handleRemoveBook = (bookId) => {
    axios.delete('/account/library', { data: {email: value, id: bookId} } )
    .then(res => {
      console.log(res);
      setOpenRemove(false);
      getUserData();
    })
    .catch(err => {
      console.log('Error sending put request to remove book: ', err);
    });
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
      email: value
    };
    axios.get('/account/library', { params })
      .then(response => {
        const data = response.data.reverse();
        //expect data to be an array of book objects with 3 props: link, title, cfi
        console.log('This is data from get /library:', data);
        const orderedData = data.map((book, index) => {
          let currBook = new Epub(book.link);
          currBook.ready.then(() => {
            currBook.coverUrl()
            .then((results) => {
              // console.log(`${book.title} cover url: , ${results}`);
              if(results) {
                document.getElementById(book.link).src = results;
                book.coverURL = results;
              } else {
                document.getElementById(book.link).src = '/book-cover.png';
                book.coverURL = '/book-cover.png'
              }
            })
            .catch((err) => console.error(err));
          });
          if (book.title.slice(book.title.length - 5, book.title.length) === '.epub') {
            book.title = book.title.slice(0, book.title.length - 5);
          }
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
    signUserOut();
    history.push('/login');
  };

  const handleMoveToMyBooks = (e) => {
    e.preventDefault();
    console.log('book id', e.target.value);
    axios.put('/account/bookmark', {
      email: value,
      id: e.target.value,
      cfi: ``,
      remainingText: '',
    })
      .then(response => {
        getUserData();
      })
      .catch(err => {
        console.log(err);
      })
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
      <div style={{display: 'flex', justifyContent: 'center', padding: '2rem', flexWrap: 'wrap' }}>
        <Search handleSearch={handleSearch} />
        <Button
          sx={{ backgroundColor: '#11A797' }}
          size='small'
          variant='contained'
          type='button'
          onClick={() => setOpenUpload(true)}
        >
          <FileUploadIcon />
        </Button>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
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
      {voiceCommandError}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '2rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '3vh' }}>Reading Now</h1>
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
            <img id={book.link} src={book.coverURL} style={{ width: '100%', height: '65%'}} />
            <CardContent sx={{ height: '4rem' }}>
              <Typography gutterBottom variant='subtitle1' component='div' sx={{ textAlign: 'center', padding: 'auto', fontSize: '2vh' }}>
                {book.title}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button size='medium' style={{ color:'#0c6057' }} value={JSON.stringify(book)} onClick={e => handleReadBook(JSON.parse(e.target.value))}>Resume</Button>
              <Button size='medium' value={book['_id']} color='warning' onClick={handleMoveToMyBooks}>Remove</Button>
            </CardActions>
          </Card>
        ))}
      </div>
      <h1 style={{ padding: '0 2rem', fontSize: '3vh' }}>My Books</h1>
      <div style={{ display: 'flex', padding: '2rem 4rem', flexWrap: 'wrap' }}>
        {displayBooks.filter(book => book.remainingText === '').length === 0  ?
          <p style={{margin: '1rem', fontSize: '1.2rem'}}>No Books</p>
          : displayBooks.filter(book => book.remainingText === '').map(book => (
          <Card sx={{ width: '15rem', margin: '1rem', height: '25rem' }}>
            <img id={book.link} src={book.coverURL} style={{ width: '100%', height: '65%'}} />
            <CardContent sx={{ height: '4rem' }}>
              <Typography gutterBottom variant='subtitle1' component='div' sx={{ textAlign: 'center', verticalAlign: 'middle', padding: 'auto', fontSize: '2vh' }}>
                {book.title}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button size='medium' style={{ color:'#0c6057' }} value={JSON.stringify(book)} onClick={e => handleReadBook(JSON.parse(e.target.value))}>Read</Button>
              <Button size='medium' value={book} color='warning' onClick={() => {
                setRemoveBook(book);
                setOpenRemove(true);
              }}>Remove</Button>
            </CardActions>
          </Card>
          ))}
      </div>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openRemove}
        onClose={() => setOpenRemove(false)}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <h2 id="unstyled-modal-title" style={{textAlign: 'center', fontSize: '2vh'}} >{`Are you sure you want to remove ${removeBook.title}?`}</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button size='small' color='warning' value={removeBook['_id']} onClick={(e) => handleRemoveBook(e.target.value)}>Yes</Button>
            <Button size='small' style={{ color: '#0c6057' }} onClick={() => {
              setRemoveBook({});
              setOpenRemove(false);
            }}>No</Button>
          </div>
        </Box>
      </StyledModal>
      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <Upload handleCloseUpload={handleCloseUpload} getUserData={getUserData}/>
        </Box>
      </StyledModal>
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

const bookMockData = [
  {
    link: 'https://s3.amazonaws.com/epubjs/books/alice/OPS/package.opf',
    title: 'Alice in Wonderland',
    CFI: 'string',
    remainingText: 'reading now',
    id: 8
  },
  {
    link: "https://blueocean.s3.us-west-1.amazonaws.com/A Legacy of Darkness by J.M. Wallace.epub",
    title: 'A Legacy of Darkness by J.M. Wallace',
    CFI: 'string',
    remainingText: '',
    id: 7
  },
  {
    link: 'https://blueocean.s3.us-west-1.amazonaws.com/A Nutcracker Christmas by Laurie Winter.epub',
    title: 'A Nutcracker Christmas by Laurie Winter',
    CFI: 'string',
    remainingText: '',
    id: 6
  },
  {
    link: 'https://blueocean.s3.us-west-1.amazonaws.com/A Wish for Father Christmas by Laura Rollins.epub',
    title: 'A Wish for Father Christmas by Laura Rollins',
    CFI: 'string',
    remainingText: 'reading now',
    id: 5
  },
  {
    link: 'https://blueocean.s3.us-west-1.amazonaws.com/Dead Sound by Anise Eden.epub',
    title: 'Dead Sound by Anise Eden',
    CFI: 'string',
    remainingText: 'reading now',
    id: 4
  },
  {
    link: 'https://blueocean.s3.us-west-1.amazonaws.com/Double Take by Elizabeth Breck.epub',
    title: 'Double Take by Elizabeth Breck',
    CFI: 'string',
    remainingText: '',
    id: 3
  },
  {
    link: 'https://blueocean.s3.us-west-1.amazonaws.com/Evergreen Love by Amy Clipsto.epub',
    title: 'Evergreen Love by Amy Clipsto',
    CFI: 'string',
    remainingText: '',
    id: 2
  },
  {
    link: 'https://blueocean.s3.us-west-1.amazonaws.com/Going Once by Sharon Sala.epub',
    title: 'Going Once by Sharon Sala',
    CFI: 'string',
    remainingText: 'reading now',
    id: 1
  },
  {
    link: 'https://blueocean.s3.us-west-1.amazonaws.com/His Interim Sweetheart by Aliyah Burke.epub',
    title: 'His Interim Sweetheart by Aliyah Burke',
    CFI: 'string',
    remainingText: '',
    id: 0
  }
];

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled('div')`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  width: '45vh',
  bgcolor: '#eaf4d2',
  border: '1px solid #000',
  p: 1,
  px: 1,
  pb: 1,
  'box-shadow': '0px 0px 3px 2px rgba(0, 0, 0, 0.5)',
  'border-radius': '5px 5px 5px',
};

export default MyAccount;
