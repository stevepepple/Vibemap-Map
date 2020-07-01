const initialState = {
  loading: false,
  currentItem: {
    name: null,
        description: null,
        address: null,
        categories: [],
        hours: null,
        instagram: null,
        phone: null,
        location: null,
        reason: null,
        tips: [],
        vibes: [],
        images: []
  }
}

const placesReducer = (state = initialState, action) => {
    switch (action.type) {
        // TODO: Do we need loading state per end point. 
        case "DETAILS_LOADING":
            console.log('DETAILS_LOADING')
            return {
                ...state,
                loading: true
            };
        
        case "DETAILS_SUCCESS":
            let currentItem = action.payload.properties
            const point = action.payload.geometry.coordinates
            currentItem['location'] = { latitude: point[1], longitude: point[0] }

            return {
                ...state,
                details: action.payload,
                currentItem: currentItem,
                loading: false
            };

        default:
            return state;

    }
}

export default placesReducer;
