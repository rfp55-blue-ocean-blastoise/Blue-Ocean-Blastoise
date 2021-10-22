import React, { useState } from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from './Library/Home';

const App = () => {
  const [name, setName] = useState("BROTHER");
  return (
    <div className="app">
      <HashRouter>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/home" component={Home} />
      </HashRouter>
    </div>
  );
};

export default App;
