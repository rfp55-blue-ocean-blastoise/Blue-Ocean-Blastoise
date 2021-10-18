import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import { signUpWithEmail } from "../firebase.js";
import axios from "axios";
import { BrowserRouter, Link, useHistory } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { value, setValue } = useContext(GlobalContext);
  const history = useHistory();

  const createUser = (e) => {
    e.preventDefault();
    signUpWithEmail(email, password) //firebase
      .then(({ user }) => {
        history.push("/librarytest");
        axios({
          // mongo
          method: "POST",
          url: "/users",
          data: {
            email: user.email,
            books: [],
          },
        })
          .then((res) => {
            setValue(email);
            console.log(res);
          })
          .catch((err) => console.log(err, "err from post user to mongo"));
      })
      .catch((err) => console.log(err, "err from firebase"));
  };

  return (
    <BrowserRouter>
      <div className="sign-up">
        <form type="submit" onSubmit={createUser}>
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
            Password PASSWORD!!! :
            <input
              type="password"
              className="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </label>

          <br />

          <input type="submit" value="Submit" />
        </form>

        <div className="signup-exists">
          Already have an account? <Link to="/">Log in</Link>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default Signup;
