import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from './Library/Home';

const App = () => {
  const [name, setName] = useState("BROTHER");
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/home" component={Home} />
      </BrowserRouter>
    </div>
  );
};

export default App;
