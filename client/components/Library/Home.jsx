import React, { useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Library from './Library';
import MyAccount from './MyAccount';
import Player from '../Player/Player';
import Login from '../Login';

const Home = () => {
  const [book, setBook] = useState({});

  const handleReadBook = (book) => {
    setBook(book);
  };

  return (
    <BrowserRouter>
        <div id="links">
          <Link to='/home'>My Account</Link>
          <Link to='/freelibrary'>Library</Link>
        </div>
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