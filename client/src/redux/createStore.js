import { createStore } from 'redux';

import { reducers } from './reducer'

import { createBrowserHistory, createMemoryHistory  } from 'history'

const history = createMemoryHistory()

const store = createStore(reducers(history));

console.log('Store: ', store)

export default store;