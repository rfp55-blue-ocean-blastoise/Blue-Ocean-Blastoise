import React, { useState, useContext } from 'react';
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { GlobalContext } from "./GlobalContextProvider";
import Login from "./Login";
import Signup from "./Signup";
import Home from './Library/Home';
import MyAccount from './Library/MyAccount';
import Library from './Library/Library';
import Player from './Player/Player';

const App = () => {
  const { value, setValue } = useContext(GlobalContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [book, setBook] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;
  console.log('user', user)

  onAuthStateChanged(auth, (user) => {
    console.log('triggered')
    return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
  });
  if (isLoggedIn) {
    console.log('islogged in ')
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
          <MyAccount handleReadBook={handleReadBook} />
        </Route>
        <Route exact path="/freelibrary" component={Library} />
        <Route exact path="/player">
          <Player book={book} />
        </Route>
      </HashRouter>
    </div>
  );
};

export default App;
