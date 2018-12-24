import { createStore } from 'redux'
import { reducers } from './reducer'

const store = createStore(reducers);
console.log('State of the store: ', store.getState())
export { store };
