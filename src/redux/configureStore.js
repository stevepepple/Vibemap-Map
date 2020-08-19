import { createStore, applyMiddleware } from "redux"
import { loadState, saveState } from './localStorage'
import thunk from "redux-thunk";
import throttle from 'lodash/throttle'

//import reducers from "../reducers/reducers.js";
import rootReducer from "./reducers/"

const configureStore = preloadedState => {

  //const persistedState = loadState()

  // Add persisted state to preloaded state
  // TODO: compose/concac or use middleware 
  const persistedState = loadState()
  const combinedState = { ...preloadedState, ... persistedState}

  const store = createStore(
    rootReducer, 
    combinedState,
    //persistedState,
    applyMiddleware(thunk)
  )

  store.subscribe(throttle(() => {

    saveState({
      savedPlaces: store.getState().savedPlaces
    })

  }, 1000))

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
