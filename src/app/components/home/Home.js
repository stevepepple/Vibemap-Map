import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.scss';

class Main extends Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
          <h2>Welcome to Vibemap</h2>
        </div>
        <p className="Home-intro">
          To get started, edit <code>src/App.js</code> or{' '}
          <code>src/Home.js</code> and save to reload.
        </p>
        <ul className="Home-resources">
          <li>
            <a href="https://github.com/jaredpalmer/razzle">Docs</a>
          </li>
          <li>
            <Link to="/news" >News</Link>
          </li>
          <li>
            <a href="https://palmer.chat">Community Slack</a>
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;
