import App from './App';
import React from 'react';

import express from 'express';
import fs from 'fs';
import compression from 'compression';
import path from 'path';

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

// Internationalization
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp('src');

import { I18nextProvider } from 'react-i18next'
import Backend from 'i18next-fs-backend'
import i18n from './services/i18n'

const i18nextMiddleware = require('i18next-http-middleware')
const i18n_config = {
  preload: ['en', 'es'],
  backend: {
    loadPath: `vibemap-constants/translations/{{lng}}.json`,
    addPath: `vibemap-constants/translations/{{lng}}.missing.json`,
  }
}

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const chunks = require(process.env.RAZZLE_CHUNKS_MANIFEST);

const server = express();

i18n
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  //.use('/locales', express.static(`${appSrc}/locales`))
  //.use(i18nextMiddleware.LanguageDetector)
  .init(
    i18n_config,
    () => {
      server
        .disable('x-powered-by')
        .use(i18nextMiddleware.handle(i18n))
        //.use('/locales', express.static(`${appSrc}/locales`))
        .use(compression())
        .use(
          // TODO: move back to express.static(process.env.RAZZLE_PUBLIC_DIR)
          express.static('public', { maxAge: '365d' })
        )
        .get('/*', async (req, res) => {
          const context = {};

          // Compile an initial state
          const preloadedState = {
            language: req.i18n.language
          };

          // Create a new Redux store instance
          const store = configureStore(preloadedState);

          console.log('req.i18n: ', req.i18n.language)
          try {
            const html = await render({
              req,
              res,
              document: Document,
              routes,
              // TODO: how to chunks assets
              assets,
              chunks,
              store
            });
            res.send(html);
          } catch (error) {
            console.error(error);
            res.json({ message: error.message, stack: error.stack });
          }
        });
    })

export default server;