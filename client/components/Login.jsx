import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import { signInWithEmail } from "../firebase.js";
import axios from "axios";
import { BrowserRouter, Link, useHistory } from "react-router-dom";
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircle from '@mui/icons-material/AccountCircle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import IconButton from '@mui/material/IconButton';
// import Upload from "./Upload";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { value, setValue } = useContext(GlobalContext);
  const history = useHistory();


  const loginUser = (e) => {
    e.preventDefault();
    signInWithEmail(email, password)
      .then((res) => {
        setValue(email);
        history.push('/home');
      })
      .catch((err) => console.log(err, "err from firebase"));
  };

  return (
    <div className="login">
      <h1 style={{ fontSize: '8rem', marginBottom: 0, color: '#212121' }}> BookBrother</h1>
      <h2>The Premier Mobile Audio Experience to Listen to Your Books</h2>
      <h3>Don’t have time to read or need to be somewhere else? No problem, just upload your book to the app and start getting knowledge injected into your earbuds</h3>
      <div>
        <form type="submit" onSubmit={loginUser}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: '0', border: '1px solid #212121', padding: '2rem', borderRadius: '5px 5px 5px', boxShadow: '0px 0px 3px 2px rgba(0, 0, 0, 0.2)', mt: '5rem' }}>
            <h2>Sign-in to get started</h2>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <FormControl sx={{ m: 1, width: '20em' }} variant="standard" required>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startAdornment={
                    <InputAdornment position='start'>
                      <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                    </InputAdornment>
                  }
                  required
                  />
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: '2em' }}>
              <FormControl sx={{ m: 1, width: '20em' }} variant="standard" required>
                <InputLabel htmlFor='password'>Password</InputLabel>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
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
            <Button variant='contained' color='primary' type='submit' onSubmit={loginUser}>
              Sign In
            </Button>
            <div style={{ marginTop: '2em' }}>
              Need to create an account?
              &nbsp;
              <Link to='/signup'>Sign-Up</Link>
            </div>
          </Box>
        </form>
      {/* <Upload/> */}
      </div>
    </div>
  );
};

export default Login;
