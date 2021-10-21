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
          <Link to='/account/library'>My Account</Link>
          <Link to='/library'>Library</Link>
        </div>
        <Route path='/account/library'>
          <MyAccount handleReadBook={handleReadBook} />
        </Route>
        <Route path='/library'>
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