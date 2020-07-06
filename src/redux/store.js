import { reducers } from './reducer'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'

const initialState = {
    uiState: [{ id: 123, text: 'hello', completed: false }]
};

export const history = createBrowserHistory()

const store = createStore(
    // Provide history state to the router in combined, route reducers.
    reducers(history), 
    initialState,
    compose(
        applyMiddleware(
            // Dispacth history actions
            routerMiddleware(history)
        ),
    ),
)

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers').default;
        store.replaceReducer(nextRootReducer);
    });
}

export { store };
