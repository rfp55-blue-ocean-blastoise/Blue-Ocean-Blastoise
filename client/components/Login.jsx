import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import { signInWithEmail, googleSignIn, makeNewSession } from "../firebase.js";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import axios from "axios";
import { BrowserRouter, Link, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import IconButton from "@mui/material/IconButton";
// import Upload from "./Upload";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { value, setValue } = useContext(GlobalContext);
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      await makeNewSession(email, password);
      setValue(email);
      history.push("/home");
    } catch (err) {
      console.log(err, "err from firebase");
    }
  };

  const handleLoginForGoogle = async (e) => {
    e.preventDefault();
    try {
      const email = await googleSignIn();
      const result = await axios({
        method: "POST",
        url: "/account",
        data: {
          email: email,
          books: [],
        },
      });
      setValue(email);
      history.push("/home");
    } catch (err) {
      console.log(err, "from handleLoginForGoogle");
    }
  };

  return (
    <div className="login">
      <h1 style={{ fontSize: "9vh", marginBottom: 0, color: "#212121" }}>
        {" "}
        BookBrother
      </h1>
      <h2 style={{ fontSize: "3vh", width: "70%", textAlign: "center" }}>
        The Premier Mobile Audio Experience to Listen to Your Books
      </h2>
      <h3 style={{ fontSize: "2vh", width: "70%", textAlign: "center" }}>
        Don’t have time to read? No problem, just upload your book to the app
        and start getting knowledge injected into your earbuds.
      </h3>
      <div>
        <form type="submit" onSubmit={loginUser}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              p: "0",
              border: "1px solid #212121",
              padding: "2vh",
              borderRadius: "5px 5px 5px",
              boxShadow: "0px 0px 3px 2px rgba(0, 0, 0, 0.2)",
              mt: "1rem",
              width: "40vh",
              mixWidth: "10px",
              height: "fit-content",
            }}
          >
            <h2 style={{ fontSize: "3vh" }}> Sign-in</h2>
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <FormControl
                sx={{ m: 1, width: "35vh", mixWidth: "8px" }}
                variant="standard"
                required
              >
                <InputLabel htmlFor="email" style={{ fontSize: "2vh" }}>
                  Email
                </InputLabel>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle
                        sx={{ color: "action.active", mr: 1, my: 0.5 }}
                      />
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", mb: "2em" }}>
              <FormControl
                sx={{ m: 1, width: "35vh", minWidth: "8px" }}
                variant="standard"
                required
              >
                <InputLabel htmlFor="password" style={{ fontSize: "1.5vh" }}>
                  Password
                </InputLabel>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
            </Box>
            <Button
              variant="contained"
              style={{ backgroundColor: "#0c6057", fontSize: "2vh",  margin: "0 0 1em 0" }}
              type="submit"
              onSubmit={loginUser}
            >
              Sign In
            </Button>
            <div className="login-buttons">
              <button
                className="login-provider-button"
                onClick={handleLoginForGoogle}
              >
                <img
                  src="https://img.icons8.com/fluency/48/000000/google-logo.png"
                  alt="google icon"
                />{" "}<br/>
                <span> Continue with Google</span>
              </button>
            </div>
            <div style={{ margin: "2em 0 1em 0", fontSize: "2vh" }}>
              Need to create an account? &nbsp;
              <Link to="/signup">Sign-Up</Link>
            </div>
          </Box>
        </form>
        {/* <Upload/> */}
      </div>
    </div>
  );
};

export default Login;
