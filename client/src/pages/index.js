import React from 'react'
import withRedux from 'next-redux-wrapper'

import { store } from '../redux/createStore'

//import { Footer, Homepage } from '../components';
//import { AppContainer, HeaderContainer } from '../containers';

const Page = () => (
    <div>
        Hello
    </div>  
)

Page.getInitialProps = ({ store, isServer, pathname, query }) => {
    // component will read from store's state when rendered
    store.dispatch({ type: 'FOO', payload: 'foo' });
    // pass some custom props to component from here
    return { custom: 'custom' };
};


export default withRedux(store)(Page)