import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createUser = (e) => {
    e.preventDefault();
    const req = {
      method: "POST",
      url: "",
      data: {
        email,
        password,
      },
    };
    console.log({ req });
    axios(req)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
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
          Password:
          <input
            type="password"
            className="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </label>

        <br />

        <input type="submit" value="Submit" />
      </form>

      <div className="signup-exists">Already have an account? Log in</div>
    </div>
  );
}
