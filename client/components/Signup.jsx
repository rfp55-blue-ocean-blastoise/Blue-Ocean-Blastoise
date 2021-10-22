import React, { useState, useContext } from "react";
import { GlobalContext } from "./GlobalContextProvider";
import { signUpWithEmail } from "../firebase.js";
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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { value, setValue } = useContext(GlobalContext);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();

  const createUser = (e) => {
    e.preventDefault();
    signUpWithEmail(email, password) //firebase
      .then(({ user }) => {
        history.push("/home");
        axios({
          // mongo
          method: "POST",
          url: "/account",
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
      <div className="login">
        <h1 style={{ fontSize: '9vh', marginBottom: 0, color: '#212121' }}> BookBrother</h1>
        <h2 style={{ fontSize: '3vh', width: '70%', textAlign: 'center'}} >The Premier Mobile Audio Experience to Listen to Your Books</h2>
        <form type="submit" onSubmit={createUser}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: '0', border: '1px solid #212121', padding: '2vh', borderRadius: '5px 5px 5px', boxShadow: '0px 0px 3px 2px rgba(0, 0, 0, 0.2)', mt: '1rem', width: '40vh', mixWidth: '10px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '3vh' }} >Sign-Up</h2>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <FormControl sx={{ m: 1, width: '35vh', mixWidth: '8px' }} variant="standard" required>
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
              <FormControl sx={{ m: 1, width: '35vh', minWidth: '8px' }} variant="standard" required>
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
            <Button variant='contained' style={{ backgroundColor: '#0c6057', fontSize: '2vh' }} type='submit' onSubmit={createUser}>
              Create Account
            </Button>
          </Box>
        </form>
      </div>
    </BrowserRouter>
  );
}

export default Signup;
