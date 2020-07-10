import React from 'react';

import { StaticRouter } from "react-router-dom";

import {
    AfterRoot,
    AfterData,
    AfterScripts,
    AfterStyles,
    SerializeData,
    __AfterContext,
} from '@jaredpalmer/after';
import { Provider } from 'react-redux';

class Document extends React.Component {
    static async getInitialProps({ renderPage, store }) {
        //console.log('store on load: ', store.getState())
        const page = await renderPage(App => props => (
            <Provider store={store}>
                <App {...props} />
            </Provider>
        ));
        return { ...page };
    }

    render() {
        const { helmet } = this.props;
        // get attributes from React Helmet
        const htmlAttrs = helmet.htmlAttributes.toComponent();
        const bodyAttrs = helmet.bodyAttributes.toComponent();

        return (
            <html {...htmlAttrs}>
                <head>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta charSet="utf-8" />
                    <title>Welcome to the Afterparty</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="preconnect" href="https://tiles.vibemap.com"/>
                    <link rel="preconnect" href="https://api.vibemap.com"/>

                    {helmet.title.toComponent()}
                    {helmet.meta.toComponent()}
                    {helmet.link.toComponent()}
                    <AfterStyles />
                </head>
                <body {...bodyAttrs}>
                    <AfterRoot />
                    <AfterData />
                    <ReduxData />
                    <AfterScripts />
                </body>
            </html>
        );
    }
}

function ReduxData() {
    const { store } = React.useContext(__AfterContext);

    return <SerializeData name="preloaded_state" data={store.getState()} />;
}

export default Document;