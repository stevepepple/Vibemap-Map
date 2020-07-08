const initialState = { 
    features: [], 
    numFeatures: 0 
}

export const editor = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_FEATURE': {
            return Object.assign({}, state, {
                features: state.features.concat(action.feature),
                numFeatures: state.numFeatures++
            })
        }
        default:
            return state
    }
}

export default editor;
