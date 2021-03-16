import React from "react";
import "./Footer.css";

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
  return (
    <footer>
      <p>Mason Leonhart &copy; 2021</p>
      <a
        href="https://masonleonhart.github.io/portfolio-site/"
        className="btn_asLink"
        target="_blank"
        title="My Github Page"
      >
        Portfolio
      </a>{" "}
      |{" "}
      <a
        href="mailto:mason.leonhart@gmail.com"
        className="btn_asLink"
        target="_blank"
        title="My Linkedin Page"
      >
        Email me
      </a>
    </footer>
  );
}

export default Footer;
