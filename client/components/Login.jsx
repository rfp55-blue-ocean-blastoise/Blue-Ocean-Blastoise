import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import { signInWithEmail } from "../firebase.js";
import axios from "axios";
import { BrowserRouter, Link, useHistory } from "react-router-dom";
// import Upload from "./Upload";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { value, setValue } = useContext(GlobalContext);
  const history = useHistory();


  const loginUser = (e) => {
    e.preventDefault();
    signInWithEmail(email, password)
      .then((res) => {
        setValue(email);
        history.push('/library');
      })
      .catch((err) => console.log(err, "err from firebase"));
  };

  return (

    <div className="login">

      <h2>Log In </h2>

      <form type="submit" onSubmit={loginUser}>
        <label>
          Email:
          <input
            type="text"
            className="email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </label>
        <br />

        <label>
          Password:
          <input
            type="password"
            className="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>

        <br />

        <input type="submit" value="Log In" />
      </form>

      <div className="need-account">
        Need an account?
        <Link to='/signup'>Sign Up </Link>
      </div>
      {/* <Upload/> */}
    </div>
  );
}

export default Login;
