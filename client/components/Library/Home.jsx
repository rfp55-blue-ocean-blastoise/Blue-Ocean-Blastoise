import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Library from './Library';
import Player from './Player';

const Home = () => {
  const [book, setBook] = useState({});

  const handleReadBook = (book) => {
    setBook(book);
  };

  return (
    <BrowserRouter>
        <Route exact path='/'>
          <Library handleReadBook={handleReadBook} />
        </Route>
        <Route path='/player'>
          <Player book={book}/>
        </Route>
    </BrowserRouter>
  )
};

export default Home;