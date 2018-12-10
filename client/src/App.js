import React, { Component } from 'react';
import EventsPage from './components/events_page';
import PlacesMap from './components/places/places_map';
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
                <Link to="/events">Nearby Events</Link>
              </Menu.Item>
              <Menu.Item>
                <Link to="/places">Places Map</Link>
              </Menu.Item>
            </Menu>
            
            <Route exact path="/events" component={EventsPage} />
            <Route exact path="/places" component={PlacesMap} />
          </div>
        </Router>
        
      </div>
    );
  }
}

export default App;
