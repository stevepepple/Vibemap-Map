const initialState = {
    allCities: [],
    // TODO: Not the best place for this. 
    clusterSize: 80,
    currentLocation: { latitude: 0, longitude: 0, name: null, distance_changed: 0 },
    currentPage: 0,
    vibes: [],
    days: "1",
    placeType: "places",
    numTopPicks: 10,
    searchTerm: "",
    totalPages: 5
}

export const nav = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_ACTIVITY': 
            let activity = action.activity
            if (action.activity === "any") action.activity = null

            return {
                ...state,
                activity: activity
            }

        case 'SET_ALL_CATEGORIES':
            return {
                ...state,
                allCategories: action.allCategories
            }
        
        case 'SET_ALL_CITIES':
            return {
                ...state,
                allCities: action.allCities
            }

        case 'SET_ALL_VIBES':
            return {
                ...state,
                allVibes: action.allVibes
            }
        
        case 'SET_CURRENT_LOCATION':
            console.log("SET_CURRENT_LOCATION: ", action)
            try {
                action.location.latitude = parseFloat(action.location.latitude)
                action.location.longitude = parseFloat(action.location.longitude)
                
            } catch (error) {
                console.log('Problem with SET_CURRENT_LOCATION', error)
            }

            return {
                ...state,
                currentLocation: action.location
            }
        
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.page
            }

        case 'SET_DAYS':
            return {
                ...state,
                days: action.days
            }
        
        case 'SET_MAIN_VIBE':
            return {
                ...state,
                mainVibe: action.vibe
            }

        case 'SET_PLACE_TYPE':
            return {
                ...state,
                placeType: action.type
            }
        
        case 'SET_SEARCH_TERM':
            return {
                ...state,
                searchTerm: action.searchTerm
            }
        
        case 'SET_TOTAL_PAGES':
            return {
                ...state,
                totalPages: action.pages
            }

        case 'SET_VIBES':
            return {
                ...state,
                vibes: action.vibes
            }

        case 'SET_VIBESETS':
            return {
                ...state,
                vibesets: action.vibesets
            }
        
        default:
            return state
    }
}

export default nav;
