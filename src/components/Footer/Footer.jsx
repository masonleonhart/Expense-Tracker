import React from "react";
import "./Footer.css";

import { makeStyles, useMediaQuery } from "@material-ui/core";

import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
import EmailIcon from "@material-ui/icons/Email";

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
  const useStyles = makeStyles({
    linkIcons: {
      width: 40,
      height: 40,
      margin: "0 10px 0 10px",
      color: "#444",
    },
  });

  const classes = useStyles();

  return (
    <footer>
      <p>Created by Mason Leonhart &copy; 2021</p>
      <div id="footer-link-wrapper">
        <a
          href="https://github.com/masonleonhart"
          target="_blank"
          rel="noreferrer"
          title='Link to Github'
        >
          <GitHubIcon className={classes.linkIcons} />
        </a>
        <a
          href="https://www.linkedin.com/in/masonleonhart/"
          target="_blank"
          rel="noreferrer"
          title='Link to Linkedin'
        >
          <LinkedInIcon className={classes.linkIcons} />
        </a>
        <a href="mailto:mason.leonhart@gmaill.com" title='Email me'>
          <EmailIcon className={classes.linkIcons} />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
