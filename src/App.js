import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';

//import { Helmet } from 'react-helmet';
//import { Helmet, HelmetProvider } from 'react-helmet-async';

import routes from './pages/routes';
import './App.scss';

const App = () => (
  <div>
    
    <Switch>
      {routes.map((route, i) => <Route key={i} {...route} />)}
    </Switch>
  </div>
  
);

export default App;
