import App from './App';
import React from 'react';
import express from 'express';
import serialize from 'serialize-javascript';

// Routing
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom";

// Redux Store
import { Provider } from 'react-redux';
import configureStore from './app/store/configureStore';

// SEO
import { Helmet } from 'react-helmet'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};

    // Compile an initial state
    const preloadedState = { };

    // Create a new Redux store instance
    const store = configureStore(preloadedState);

    const markup = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    );

    const helmet = Helmet.renderStatic()
    const title = 'Test Title Here'

    console.log('helmet: ', helmet.link.toString())

    // Grab the initial state from our Redux store
    const finalState = store.getState();

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      redirect(301, context.url);
    } else {
      res.send(
        // prettier-ignore
        `<!doctype html>
        <html lang="en" ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}

            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <meta name="viewport" content="width=device-width, initial-scale=1">            
            <meta name="mobile-web-app-capable" content="yes">
            <meta name="apple-mobile-web-app-capable" content="yes">
            <meta name="twitter:card" content="summary">
            <meta name="twitter:site" content="@Vibemap">

            ${
            assets.client.css
              ? `<link rel="stylesheet" href="${assets.client.css}">`
              : ''
            } 
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            <div id="root">${markup}</div>    
            <script src="${assets.client.js}" defer crossorigin></script>
            <script>
              window.__PRELOADED_STATE__ = ${serialize(finalState)}
            </script>
        </body>
        </html>`
      );
    }
  });

export default server;