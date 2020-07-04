import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

//import reducers from "../reducers/reducers.js";
import { reducers } from "../../redux/reducer.js"

const configureStore = preloadedState => {
  const store = createStore(reducers, preloadedState, applyMiddleware(thunk));

  return store;
}


export default configureStore;
