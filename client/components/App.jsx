import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./Login";
import Upload from "./Upload";
import Signup from "./Signup";
import Home from './Library/Home';

const App = () => {
  const [name, setName] = useState("BROTHER");
  return (
    <div className="app">
      <BrowserRouter>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/library" component={Home} />
      </BrowserRouter>
    </div>
  );
};

export default App;
