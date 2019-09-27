import { createStore } from 'redux'
import { reducers } from './reducer'


const initialState = {
    uiState: [{ id: 123, text: 'hello', completed: false }]
};

const store = createStore(reducers, initialState);

console.log('State of the store: ', store.getState())
export { store };
