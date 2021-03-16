import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import { useSelector, useDispatch } from "react-redux";
import { PlaidLink } from "react-plaid-link";
import axios from "axios";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { AppBar, Toolbar, Button, Drawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import HomeIcon from "@material-ui/icons/Home";
import TodayIcon from "@material-ui/icons/Today";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import MenuIcon from "@material-ui/icons/Menu";
import FeedbackIcon from "@material-ui/icons/Feedback";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

function Nav() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const plaid = useSelector((store) => store.plaid);
  const matches = useMediaQuery("(max-width:820px)");
  const [toggleDrawer, setToggleDrawer] = useState(false);

  let loginLinkData = {
    path: "/login",
    text: "Login / Register",
  };

  if (user.id != null) {
    loginLinkData.path = "/user";
    loginLinkData.text = "Home";
  }

  const plaidLinkSuccess = React.useCallback(async (public_token) => {
    // An on success function for the plaid link, when a successful link is created, wait 3 seconds and
    // fetch the user again so the access token appears in state

    try {
      await axios.post("/api/plaid/exchange_token", { public_token });
      setTimeout(() => dispatch({ type: "FETCH_USER" }), 3000);
    } catch (error) {
      console.log("Error in exchanging tokens", error);
    }
  });

  const useStyles = makeStyles((theme) => ({
    menuIcon: {
      color: "white",
      width: "36px",
      height: "36px",
    },
    menuButton: {
      color: "white",
    },
    navLink: {
      color: "#f2f2f2",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
      width: "30%",
    },
    drawerPaper: {
      width: "30%",
    },
    drawerButton: {
      height: "50px",
    },
  }));

  const classes = useStyles();

  return (
    <>
      <AppBar className={classes.appBar}>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: matches && '100%'
            }}
          >
            <Link to="/home">
              <h2 className="nav-title">Melt</h2>
            </Link>
            {matches && (
              // Only show menu icon if screen width is shorter than the "matches" width
              <Button
                className={classes.menuButton}
                id={plaid.plaidError ? "menuError" : ""}
                onClick={() =>
                  !toggleDrawer ? setToggleDrawer(true) : setToggleDrawer(false)
                }
              >
                Menu
                <MenuIcon className={classes.menuIcon} />
              </Button>
            )}
            {!matches && (
              // If the screen width is more than the "matches" width, render the nav buttons
              // On the nav bar
              <>
                <Button
                  component={Link}
                  className={classes.navLink}
                  to={loginLinkData.path}
                >
                  {user.id && <HomeIcon style={{ color: "white" }} />}
                  {/* Render the home icon if the user is logged in */}
                  {loginLinkData.text}
                </Button>

                {user.id && (
                  <>
                    <Button
                      component={Link}
                      className={classes.navLink}
                      to="/month"
                    >
                      <CalendarTodayIcon />
                      Month
                    </Button>

                    <Button
                      component={Link}
                      className={classes.navLink}
                      to="/day"
                    >
                      <TodayIcon />
                      Day
                    </Button>

                    <Button
                      component={Link}
                      className={classes.navLink}
                      to="/feedback"
                    >
                      <FeedbackIcon />
                      Feedback
                    </Button>

                    {user.plaid_key && (
                      <>
                        {!user.access_token && (
                          // If the user does not have an access token, render the plaidLink button to connect thier bank account
                          <Button>
                            <PlaidLink
                              style={{
                                background: "none",
                                padding: "none",
                                border: "none",
                                borderRadius: "none",
                                fontSize: 15,
                                color: "white",
                                fontWeight: "500",
                                display: "flex",
                                alignItems: "center",
                                fontWeight: "500",
                              }}
                              token={plaid.linkToken}
                              onSuccess={plaidLinkSuccess}
                            >
                              <AccountBalanceIcon />
                              CONNECT YOUR BANK
                            </PlaidLink>
                          </Button>
                        )}
                        {plaid.plaidError && (
                          // If plaid threw an error when trying to connect, render a plaidlink for the user to refresh their credentials
                          <Button style={{ cursor: "pointer" }}>
                            <div className="navLink">
                              <PlaidLink
                                style={{
                                  background: "none",
                                  padding: "none",
                                  border: "none",
                                  borderRadius: "none",
                                  fontSize: 15,
                                  color: "red",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                                token={plaid.linkToken}
                                onSuccess={(public_token, metadata) =>
                                  setTimeout(() => {
                                    dispatch({ type: "SET_PLAID_ERROR_FALSE" });
                                    dispatch({ type: "FETCH_USER" });
                                  }, 3000)
                                }
                              >
                                <ErrorOutlineIcon />
                                UPDATE CREDENTIALS
                              </PlaidLink>
                            </div>
                          </Button>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {user.id && !matches ? (
            // If the user is logged in and the screen width is more than the screen width,
            // render the nav buttons on the nav bar
            <Button
              className={classes.navLink}
              onClick={() => dispatch({ type: "LOGOUT" })}
            >
              <ExitToAppIcon />
              Log Out
            </Button>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
      <br />
      <br />
      <br />
      <br />
      <Drawer
        open={toggleDrawer}
        anchor='right'
        onClose={() => setToggleDrawer(false)}
        variant="persistent"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Button
            component={Link}
            to={loginLinkData.path}
            className={classes.drawerButton}
            onClick={() => setToggleDrawer(false)}
          >
            {user.id && <HomeIcon />}
            {/* render the home icon if the user is logged in */}
            {loginLinkData.text}
          </Button>
          {user.id && (
            <>
              {/* If the user is logged in, render the nav links and the logout 
            button in the drawer */}
              <Button
                component={Link}
                to="/month"
                className={classes.drawerButton}
                onClick={() => setToggleDrawer(false)}
              >
                <CalendarTodayIcon />
                Month
              </Button>

              <Button
                component={Link}
                to="/day"
                className={classes.drawerButton}
                onClick={() => setToggleDrawer(false)}
              >
                <TodayIcon />
                Day
              </Button>

              <Button
                component={Link}
                to="/feedback"
                className={classes.drawerButton}
                onClick={() => setToggleDrawer(false)}
              >
                <FeedbackIcon />
                Feedback
              </Button>

              {user.plaid_key && (
                <>
                  {!user.access_token && (
                    // If the user does not have an access token, render the plaidLink button to connect thier bank account
                    <Button>
                      <PlaidLink
                        style={{
                          background: "none",
                          padding: "none",
                          border: "none",
                          borderRadius: "none",
                          fontSize: 15,
                          color: "black",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "500",
                        }}
                        token={plaid.linkToken}
                        onSuccess={plaidLinkSuccess}
                      >
                        <AccountBalanceIcon />
                        CONNECT YOUR BANK
                      </PlaidLink>
                    </Button>
                  )}
                  {plaid.plaidError && (
                    // If plaid threw an error when trying to connect, render a plaidlink for the user to refresh their credentials
                    <Button style={{ cursor: "pointer" }}>
                      <div className="navLink">
                        <PlaidLink
                          style={{
                            background: "none",
                            padding: "none",
                            border: "none",
                            borderRadius: "none",
                            fontSize: 15,
                            color: "red",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          token={plaid.linkToken}
                          onSuccess={(public_token, metadata) =>
                            setTimeout(() => {
                              dispatch({ type: "SET_PLAID_ERROR_FALSE" });
                              dispatch({ type: "FETCH_USER" });
                            }, 3000)
                          }
                        >
                          <ErrorOutlineIcon />
                          UPDATE CREDENTIALS
                        </PlaidLink>
                      </div>
                    </Button>
                  )}
                </>
              )}

              <Button
                className={classes.drawerButton}
                onClick={() => {
                  dispatch({ type: "LOGOUT" });
                  setToggleDrawer(false);
                }}
              >
                <ExitToAppIcon />
                Log Out
              </Button>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default Nav;
