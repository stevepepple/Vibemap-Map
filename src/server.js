import App from './App';
import React from 'react';
import express from 'express';

import compression from 'compression';
// Routing & After.js
import { render } from '@jaredpalmer/after';

import routes from './pages/routes';

import Document from './pages/Document';

// Redux Store
import configureStore from './redux/configureStore';

// SEO
//import { Helmet } from 'react-helmet'
import { Helmet, HelmetProvider } from 'react-helmet-async';
const helmetContext = {};
const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const chunks = require(process.env.RAZZLE_CHUNKS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(compression())
  .use(
    // TODO: move back to express.static(process.env.RAZZLE_PUBLIC_DIR)
    express.static('public', { maxAge: '365d'})
  )
  .get('/*', async (req, res) => {
    const context = {};

    // Compile an initial state
    const preloadedState = {};

    // Create a new Redux store instance
    const store = configureStore(preloadedState);

    try {
      const html = await render({
        req,
        res,
        routes,
        // TODO: how to chunks assets
        assets,
        chunks,
        document: Document,
        store
      });
      res.send(html);
    } catch (error) {
      console.error(error);
      res.json({ message: error.message, stack: error.stack });
    }

  });

export default server;