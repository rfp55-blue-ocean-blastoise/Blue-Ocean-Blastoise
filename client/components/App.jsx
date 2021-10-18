import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./Login";
import Upload from "./Upload";
import Signup from "./Signup";
import LibraryTest from './LibraryTest';

const App = () => {
  const [name, setName] = useState("BROTHER");
  return (
    <BrowserRouter>
    <div className="app">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/librarytest" component={LibraryTest} />
        </Switch>
    </div>
      </BrowserRouter>
  );
};

export default App;
