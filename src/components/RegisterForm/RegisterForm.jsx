import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, TextField, makeStyles } from '@material-ui/core';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        email: email,
        username: username,
        password: password,
      },
    });
  }; // end registerUser

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#4CBB17'
      }
    }
  });

  const useStyles = makeStyles({
    button: {
      color: 'white'
    }
  });

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <form className="formPanel" onSubmit={registerUser}>
        <h2>Register User</h2>
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <TextField
          required
          type='email'
          label='Email Address'
          variant='outlined'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <br />
        <TextField
          required
          label='Username'
          variant='outlined'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <br />
        <TextField
          required
          type='password'
          label='Password'
          variant='outlined'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <br />
        <Button type='submit' className={classes.button} variant='contained' color='primary'>Register</Button>
      </form>
    </ThemeProvider>
  );
}

export default RegisterForm;
