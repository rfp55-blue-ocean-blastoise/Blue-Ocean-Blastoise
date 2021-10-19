import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Library from './Library';
import Player from './Player';

const Home = () => {
  const [bookURL, setBookURL] = useState('');

  const handlePlayBook = (url) => {
    setBookURL(url);
  };

  return (
    <BrowserRouter>
        <Route exact path='/'>
          <Library handlePlayBook={handlePlayBook} />
        </Route>
        <Route path='/player'>
          <Player url={bookURL}/>
        </Route>
    </BrowserRouter>
  )
};

export default Home;