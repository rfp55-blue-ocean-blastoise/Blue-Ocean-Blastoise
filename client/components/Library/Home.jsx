import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Library from './Library';
import Player from '../Player/Player';
import Login from '../Login';

const Home = () => {
  const [book, setBook] = useState({});

  const handleReadBook = (book) => {
    setBook(book);
  };

  return (
    <BrowserRouter>
        <Route path='/library'>
          <Library handleReadBook={handleReadBook} />
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