import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

//import reducers from "../reducers/reducers.js";
import rootReducer from "./reducers/"

const configureStore = preloadedState => {
  const store = createStore(
    rootReducer, 
    preloadedState, 
    applyMiddleware(thunk)
  )

  /*
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducer', () => {
      const nextRootReducer = require('./reducer').default
      store.replaceReducer(nextRootReducer)
    })
  }
  */


  return store
}

export default configureStore
