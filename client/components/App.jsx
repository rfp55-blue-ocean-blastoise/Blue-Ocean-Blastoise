import React, { useState, useContext, useRef } from 'react';
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GlobalContext } from "./GlobalContextProvider";
import Login from "./Login";
import Signup from "./Signup";
import MyAccount from './Library/MyAccount';
import Library from './Library/Library';
import Player from './Player/Player';

const App = () => {
  const { value, setValue } = useContext(GlobalContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [book, setBook] = useState({});
  const highlightBookRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  onAuthStateChanged(auth, (user) => {
    return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
  });
  if (isLoggedIn) {
    setValue(user.email);
  }

  const handleReadBook = (book) => {
    setBook(book);
  };

  return (
    <div>
      <HashRouter>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/home">
          <MyAccount handleReadBook={handleReadBook} highlightBookRef={highlightBookRef} />
        </Route>
        <Route exact path="/freelibrary" component={Library} />
        <Route exact path="/player">
          <Player book={book} highlightBookRef={highlightBookRef} />
        </Route>
      </HashRouter>
    </div>
  );
};

export default App;
