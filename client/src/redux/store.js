import { reducers } from './reducer'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory, createMemoryHistory } from 'history'

// Handles async functions, called Thunks
import thunk from 'redux-thunk'

const initialState = {
    uiState: [{ id: 123, text: 'hello', completed: false }]
};

// A nice helper to tell us if we're on the server
export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

// Create a history depending on the environment
export const history = isServer
    ? createMemoryHistory({
        initialEntries: ['/']
    })
    : createBrowserHistory();

const middleware = [history, thunk]

const store = createStore(
    // Provide history state to the router in combined, route reducers.
    reducers(history), 
    initialState,
    compose(
        applyMiddleware(
            // Dispacth history actions
            routerMiddleware(middleware)
        ),
    ),
)

export { store };
