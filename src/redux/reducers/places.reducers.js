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
    },
    sections: [
        { key: 'vibe', text: 'Vibe' },
        { key: 'plan', text: 'Plan' },
        { key: 'tips', text: 'Tips' },
        { key: 'more', text: 'More' },
    ]
}

const places = (state = initialState, action) => {
    switch (action.type) {
        // TODO: Do we need loading state per end point. 
        case "SET_DETAILS_LOADING":
            return {
                ...state,
                detailsLoading: action.detailsLoading
            }

        case "SET_DETAILS_ID":
            return {
                ...state,
                detailsId: action.id
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
