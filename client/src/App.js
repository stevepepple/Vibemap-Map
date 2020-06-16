import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import MainPage from './components/pages/main';
import EventCalendar from './components/pages/calendar';
import ProfileLookUp from './components/pages/profile';
import VibeGenerator from './components/pages/vibe_generator';
import SketchMap from './components/pages/SketchMap';

import GA from './services/GoogleAnalytics'

import { withTranslation } from 'react-i18next';

// Include themed version of Semantic UI styles
import 'vibemap-constants/design-system/semantic/dist/semantic.css';

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
  
          <div id='container'>               
            {GA.init() && <GA.RouteTracker />}
          
            <Switch>
              <Route path="/calendar" component={EventCalendar} />
              <Route path="/places" component={MainPage} />
              <Route path="/profile" component={ProfileLookUp} />
              <Route path="/generator" component={VibeGenerator} />
              <Route path="/draw" component={SketchMap} />
              <Route path="/" component={MainPage} />
            </Switch>

          </div>
        </Router>
        
      </div>
    );
  }
}

export default withTranslation()(App);
