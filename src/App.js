import React, { Component } from 'react';
import EventsPage from './components/events_page';
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom";
import { Menu } from 'semantic-ui-react'

import './App.css';


class App extends Component {
  state = { activeItem: 'home' }

  render() {
    const { activeItem } = this.state

    return (
      <div className="App">
  
        <Router>
          <div>
            <Menu pointing>
              <Menu.Item>
                <Link to="/events">Events</Link>
              </Menu.Item>
            </Menu>
            
            <Route exact path="/events" component={EventsPage} />
          </div>
        </Router>
        
      </div>
    );
  }
}

export default App;
