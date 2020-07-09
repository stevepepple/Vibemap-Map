import React from 'react';

import './client.css';

import { hydrate } from 'react-dom';
import { ensureReady, After, getSerializedData } from '@jaredpalmer/after';
import routes from './pages/routes';

// React Router 
import { BrowserRouter as Router } from 'react-router-dom'

// React Redux
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";

// TODO: How to chuck and minimize this
import 'vibemap-constants/design-system/semantic/dist/semantic.min.css';


// This is a key step that gets the preloaded inialProps
const preloadedState = getSerializedData('preloaded_state');

const store = configureStore(preloadedState);

function renderApp() {

  ensureReady(routes).then(data =>

    hydrate(
      <Provider store={store}>
          <Router>
            {/* App.js replaced by After which preloads initial props */}
            <After data={data} routes={routes} store={store} />            
          </Router>
      </Provider>,
      document.getElementById('root')
    )
  )
}

renderApp();

if (module.hot) {
  module.hot.accept('./pages/routes', renderApp);
}
