import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';
import { useSelector, useDispatch } from 'react-redux';
import { PlaidLink } from 'react-plaid-link';
import axios from 'axios';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AppBar, Toolbar, Button, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import TodayIcon from '@material-ui/icons/Today';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MenuIcon from '@material-ui/icons/Menu';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

function Nav() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const plaid = useSelector(store => store.plaid);
  const matches = useMediaQuery('(max-width:820px)');
  const [toggleDrawer, setToggleDrawer] = useState(false);

  let loginLinkData = {
    path: '/login',
    text: 'Login / Register',
  };

  if (user.id != null) {
    loginLinkData.path = '/user';
    loginLinkData.text = 'Home';
  }

  const plaidLinkSuccess = React.useCallback(async public_token => {
    // An on success function for the plaid link, when a successful link is created, wait 3 seconds and
    // fetch the user again so the access token appears in state

    try {
      await axios.post('/api/plaid/exchange_token', { public_token });
      setTimeout(() => dispatch({ type: 'FETCH_USER' }), 3000);
    } catch (error) {
      console.log('Error in exchanging tokens', error);
    };
  });

  const useStyles = makeStyles((theme) => ({
    menuIcon: {
      color: 'white',
      width: '36px',
      height: '36px'
    },
    menuButton: {
      minHeight: '64px',
      borderRadius: '50%'
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: '#4CBB17'
    },
    drawer: {
      width: '30%'
    },
    drawerPaper: {
      width: '30%'
    },
    drawerButton: {
      height: '50px'
    }
  }));

  const classes = useStyles();

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {matches &&
              // Only show menu icon if screen width is shorter than the "matches" width
              <Button className={classes.menuButton}
                onClick={() => !toggleDrawer ? setToggleDrawer(true) : setToggleDrawer(false)}
              >
                <MenuIcon className={classes.menuIcon} />
              </Button>
            }
            <Link to="/home">
              <h2 className="nav-title">Expense Tracker</h2>
            </Link>
            {!matches &&
              // If the screen width is more than the "matches" width, render the nav buttons
              // On the nav bar
              <>
                <Button>
                  {user.id && <HomeIcon style={{ color: 'white' }} />}
                  {/* Render the home icon if the user is logged in */}
                  <Link className="navLink" to={loginLinkData.path}>
                    {loginLinkData.text}
                  </Link>
                </Button>

                {user.id &&
                  <>
                    <Button>
                      <Link className="navLink" to="/month">
                        <CalendarTodayIcon />
                        <p>Month</p>
                      </Link>
                    </Button>
                    <Button>
                      <Link className="navLink" to="/day">
                        <TodayIcon />
                        <p>Day</p>
                      </Link>
                    </Button>
                    {!user.access_token &&
                      // If the user does not have an access token, render the plaidLink button to connect thier bank account
                      <Button>
                        <div className='navLink'>
                          <PlaidLink
                            style={{
                              background: 'none',
                              padding: 'none',
                              border: 'none',
                              borderRadius: 'none',
                              fontSize: 15,
                              color: 'white',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              fontWeight: '500'
                            }}
                            token={plaid.linkToken}
                            onSuccess={plaidLinkSuccess}
                          >
                            <AccountBalanceIcon />
                            <p>CONNECT YOUR BANK</p>
                          </PlaidLink>
                        </div>
                      </Button>}
                    {plaid.plaidError &&
                      // If plaid threw an error when trying to connect, render a plaidlink for the user to refresh their credentials
                      <Button style={{ cursor: 'pointer' }}>
                        <div className='navLink'>
                          <PlaidLink
                            style={{
                              background: 'none',
                              padding: 'none',
                              border: 'none',
                              borderRadius: 'none',
                              fontSize: 15,
                              color: 'red',
                              fontWeight: '500',
                              display: 'flex',
                              alignItems: 'center',
                              fontWeight: 'bold',
                              cursor: 'pointer'
                            }}
                            token={plaid.linkToken}
                            onSuccess={(public_token, metadata) => setTimeout(() => { dispatch({ type: 'SET_PLAID_ERROR_FALSE' }); dispatch({ type: 'FETCH_USER' }) }, 3000)}
                          >
                            <ErrorOutlineIcon />
                            <p>UPDATE CREDENTIALS</p>
                          </PlaidLink>
                        </div>
                      </Button>
                    }
                  </>
                }
              </>
            }
          </div>
          {user.id && !matches ? (
            // If the user is logged in and the screen width is more than the screen width,
            // render the nav buttons on the nav bar
            <Button onClick={() => dispatch({ type: 'LOGOUT' })}>
              <div className='navLink'>
                <ExitToAppIcon />
                <p>Log Out</p>
              </div>
            </Button>
          ) : <></>}
        </Toolbar>
      </AppBar>
      <br />
      <br />
      <br />
      <br />
      <Drawer
        open={toggleDrawer}
        onClose={() => setToggleDrawer(false)}
        variant='persistent'
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <br />
          <Button className={classes.drawerButton} onClick={() => setToggleDrawer(false)}>
            {user.id && <HomeIcon />}
            {/* render the home icon if the user is logged in */}
            <Link className='drawerNavLink' to={loginLinkData.path}>
              {loginLinkData.text}
            </Link>
          </Button>
          {user.id && <>
            {/* If the user is logged in, render the nav links and the logout 
            button in the drawer */}
            <Button className={classes.drawerButton} onClick={() => setToggleDrawer(false)}>
              <Link className='drawerNavLink' to="/month">
                <CalendarTodayIcon />
                <p>Month</p>
              </Link>
            </Button>

            <Button className={classes.drawerButton} onClick={() => setToggleDrawer(false)}>
              <Link className='drawerNavLink' to="/day">
                <TodayIcon />
                <p>Day</p>
              </Link>
            </Button>

            <Button className={classes.drawerButton} onClick={() => {
              dispatch({ type: 'LOGOUT' });
              setToggleDrawer(false);
            }}>
              <div className='drawerNavLink'>
                <ExitToAppIcon />
                <p>Log Out</p>
              </div>
            </Button>
          </>}
        </div>
      </Drawer>
    </>
  );
}

export default Nav;
