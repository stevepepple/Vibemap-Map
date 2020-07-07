const initialState = {
  loading: false
}

const mapReducer = (state = initialState, action) => {
    console.log('Map Reducer: ', action.type)
    switch (action.type) {
        // TODO: Do we need loading state per end point. 
        case "SET_MAP_READY":
            state = action.ready
            return state
        

        default:
            return state;

    }
}

export default mapReducer;
