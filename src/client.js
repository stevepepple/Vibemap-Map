import React from 'react';

import './client.css';

import { hydrate } from 'react-dom';
import { ensureReady, After, getSerializedData } from '@jaredpalmer/after';
import routes from './pages/routes';

// Internationalization
import i18n from './services/i18n';
import { I18nextProvider, useSSR } from 'react-i18next';

// React Router 
import { BrowserRouter as Router } from 'react-router-dom'
import GA from './services/GoogleAnalytics'

// React Redux
import { Provider } from "react-redux";
import configureStore from "./redux/configureStore";

// TODO: How to chuck and minimize this
import 'vibemap-constants/design-system/semantic/dist/semantic.min.css';

// This is a key step that gets the preloaded inialProps
const preloadedState = getSerializedData('preloaded_state');

const store = configureStore(preloadedState);

function renderApp() {

  //useSSR(window.initialI18nStore, window.initialLanguage);

  //console.log('client.js props: ', data)

  ensureReady(routes).then(data =>

    hydrate(
      <Provider store={store}>
        <I18nextProvider
          i18n={i18n}
          initialI18nStore={window.initialI18nStore}
          initialLanguage={preloadedState.language}>
          <Router>
            {GA.init() && <GA.RouteTracker />}

            {/* App.js replaced by After which preloads initial props */}
            <After data={data} routes={routes} store={store} />            
          </Router>
        </I18nextProvider>
      </Provider>,
      document.getElementById('root')
    )
  )
}

renderApp();

if (module.hot) {
  module.hot.accept('./pages/routes', renderApp);
}
