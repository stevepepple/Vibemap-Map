import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Menu, Dropdown } from 'semantic-ui-react'

import MainPage from './components/pages/main';
import EventCalendar from './components/pages/calendar';

import { withTranslation } from 'react-i18next';


import './styles/App.css';

class App extends Component {
  state = { 
    activeItem: 'home',
    value: 'es'
  }

  render() {

    return (
      <div className="App">
  
        <Router>
          <div>
            <Menu id="header" pointing>
              <Dropdown button labeled className='icon main_menu  ' icon='list' text='Menu'>
                <Dropdown.Menu>
                  <Dropdown.Item>
                    <Link to="/places">Nearby</Link>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Link to="/calendar">Calendar</Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              
            </Menu>
            
            <Switch>
              <Route path="/calendar" component={EventCalendar} />
              <Route path="/places" component={MainPage} />
              <Route path="/" component={MainPage} />
            </Switch>

          </div>
        </Router>
        
      </div>
    );
  }
}

export default withTranslation()(App);
