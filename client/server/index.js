import path from 'path';
import fs from 'fs';

import 'ignore-styles'

import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';

import { Provider } from 'react-redux'
import { store } from '../src/redux/store';

import { Helmet, HelmetProvider } from 'react-helmet-async';

import { StaticRouter } from 'react-router'


import App from '../src/App';

const PORT = process.env.PORT || 3006;
const app = express();


app.use(express.static('./build'));

app.get('/*', (req, res) => {
    const context = {};
    const helmetContext = {};

    //console.log('query params: ', req)

    const app = ReactDOMServer.renderToString(
        <StaticRouter
            location={req.url}
            context={context}>
                <Provider store={store}>
                    <HelmetProvider context={helmetContext}>
                        <App/>
                    </HelmetProvider>
                </Provider>
        </StaticRouter>);

    const indexFile = path.resolve('./build/index.html');
    fs.readFile(indexFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Something went wrong:', err);
            return res.status(500).send('Oops, better luck next time!');
        }

        return res.send(
            data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
        );
    });
});

app.listen(PORT, () => {
    console.log('😎 Server is listening on port: ', PORT);
});