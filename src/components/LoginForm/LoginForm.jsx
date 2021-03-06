import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { Button, TextField, makeStyles } from '@material-ui/core';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

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
      <form className="formPanel" onSubmit={login}>
        <h2>Login</h2>
        {errors.loginMessage && (
          <h3 className="alert" role="alert">
            {errors.loginMessage}
          </h3>
        )}
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
        <Button type='submit' className={classes.button} variant='contained' color='primary'>Log In</Button>
      </form>
    </ThemeProvider>
  );
}

export default LoginForm;
