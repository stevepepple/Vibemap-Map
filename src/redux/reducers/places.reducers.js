const initialState = {
    loading: false,
    placesLoading: false,
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

const places = (state = initialState, action) => {
    switch (action.type) {
        // TODO: Do we need loading state per end point. 
        case "DETAILS_LOADING":
            return {
                ...state,
                loading: true
            }

        case "SET_PLACES_LOADING":
            return {
                ...state,
                placesLoading: action.placesLoading
            }

        case "DETAILS_SUCCESS":
            let currentItem = action.payload.properties
            const point = action.payload.geometry.coordinates
            currentItem['location'] = { latitude: point[1], longitude: point[0] }

            return {
                ...state,
                details: action.payload,
                currentItem: currentItem,
                loading: false
            }

        case "SET_CURRENT_ITEM":
            return {
                ...state,
                currentItem: place
            }


        default:
            return state;

    }
}

export default places;
