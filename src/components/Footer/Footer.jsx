import React from 'react';
import './Footer.css';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

function Footer() {
  return <footer>
    <p>&copy; Mason Leonhart</p>
    <p><a href="https://github.com/masonleonhart"
          className="btn_asLink"
          target='_blank'
          title='My Github Page'
        >
          github.com/masonleonhart
        </a> | <a href="https://www.linkedin.com/in/masonleonhart/"
          className="btn_asLink"
          target='_blank'
          title='My Linkedin Page'
        >
          linkedin.com/in/masonleonhart
        </a> | mason.leonhart@gmail.com</p>
  </footer>;
}

export default Footer;
