import React, { useState, useContext } from 'react';
import { BrowserRouter, Route, Link, useHistory } from 'react-router-dom';
import { GlobalContext } from "../GlobalContextProvider";
import Library from './Library';
import MyAccount from './MyAccount';
import Player from '../Player/Player';
import Login from '../Login';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Home = () => {
  const [book, setBook] = useState({});
  const [tab, setTab] = useState('My Account');
  const history = useHistory();
  const { value, setValue } = useContext(GlobalContext);

  const handleReadBook = (book) => {
    setBook(book);
  };

  const handleLogOut = () => {
    setValue('');
    history.push('/');
  };

  return (
    <BrowserRouter>
      <div className='banner' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
        <h1 style={{ fontSize: '7vw', marginLeft: '5%' }} > BookBrother</h1>
        <Button
          style={{ height: '2rem', backgroundColor: '#0c6057', marginRight: '5%', fontSize: '80%', width: 'fit-content', padding: 'auto' }}
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
          textColor='secondary'
          indicatorColor='secondary'
          aria-label="secondary tabs example"
          centered
        >
          <Tab label='My Account' value='My Account' component={Link} to={'/home'}/>
          <Tab label='Library' value='Library' component={Link} to={'/freelibrary'}/>
        </Tabs>
      </Box>
      <Route path='/home'>
        <MyAccount handleReadBook={handleReadBook} />
      </Route>
      <Route path='/freelibrary'>
        <Library />
      </Route>
      <Route path='/player'>
        <Player book={book}/>
      </Route>
      <Route exact path='/'>
        <Login />
      </Route>
    </BrowserRouter>
  )
};

export default Home;