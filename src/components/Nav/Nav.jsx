import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';
import { useSelector, useDispatch } from 'react-redux';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { AppBar, Toolbar, Button, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import TodayIcon from '@material-ui/icons/Today';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MenuIcon from '@material-ui/icons/Menu';

function Nav() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
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
      minWidth: '75%'
    },
    drawerPaper: {
      width: '75%'
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

                <Button>
                  <Link className="navLink" to="/day">
                    <TodayIcon />
                    <p>Day Page</p>
                  </Link>
                </Button>

                <Button>
                  <Link className="navLink" to="/month">
                    <CalendarTodayIcon />
                    <p>Month Page</p>
                  </Link>
                </Button>
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
              <Link className='drawerNavLink' to="/day">
                <TodayIcon />
                <p>Day Page</p>
              </Link>
            </Button>

            <Button className={classes.drawerButton} onClick={() => setToggleDrawer(false)}>
              <Link className='drawerNavLink' to="/month">
                <CalendarTodayIcon />
                <p>Month Page</p>
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
