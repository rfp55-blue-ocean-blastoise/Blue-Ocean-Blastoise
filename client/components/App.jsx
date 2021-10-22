import React, { useState, useEffect, useContext } from 'react';
import { HashRouter, Switch, Route, Link } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from './Library/Home';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { GlobalContext } from "./GlobalContextProvider";

import MyAccount from './Library/MyAccount';
import Library from './Library/Library'
import Player from './Player/Player';


const App = () => {
  const { value, setValue } = useContext(GlobalContext);
  const [name, setName] = useState("BROTHER");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  onAuthStateChanged(auth, (user) => {
    return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
  });
  if (isLoggedIn) {
    setValue(user.email);
  }



  return (
    <div className="app">
      <HashRouter>
        {isLoggedIn ? <div id="links">
          <Link to='/home'>My Account</Link>
          <Link to='/freelibrary'>Library</Link>
        </div> : null}

        <Route path='/home'>
          <MyAccount  /> {/* this needs handleReadBook={handleReadBook} */}
        </Route>
        <Route path='/freelibrary'>
          <Library />
        </Route>
        <Route path='/player'>
          <Player /> {/* this needs book={book} */}
        </Route>
        {/* <Route exact path='/'>
          <Login />
        </Route> */}

        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {/* <Route path="/home" component={Home} /> */}
      </HashRouter>
    </div>
  );
};

export default App;
