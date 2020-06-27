import BrowserRouter from 'react-router-dom/BrowserRouter';
import React from 'react';
import { hydrate } from 'react-dom';

// React Router 
import { BrowserRouter as Router } from 'react-router-dom'

// React Redux
import { Provider } from "react-redux";
import configureStore from "../src/app/store/configureStore";

import App from './App';

const store = configureStore(window.__initialData__);

hydrate(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
