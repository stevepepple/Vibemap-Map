import * as Constants from '../../constants.js'

const initialState = {
    activity: "all",
    allCities: [{ "id": "6bfe09a3-34c3-489a-8693-c6da18d5a528", "name": "Oakland, CA", "centerpoint": [-122.27113722052206, 37.80438719710896], "zoom_start": 12, "bearing_start": 26.3, "pitch_start": null, "key": "6bfe09a3-34c3-489a-8693-c6da18d5a528", "value": "6bfe09a3-34c3-489a-8693-c6da18d5a528", "text": "Oakland, CA", "distance": 4116.363748935814 }],
    allVibes: [],
    // TODO: Not the best place for this. 
    clusterSize: 200, // meters
    currentLocation: { latitude: 0, longitude: 0, name: null, distance_changed: 0 },
    currentPage: 0,
    hasLocation: false,
    vibes: [],
    vibesets: [],
    days: "1",
    date_options: [
        { key: '1', text: 'Today', value: '1' },
        { key: '2', text: '2 days', value: '2' },
        { key: '3', text: '3 days', value: '3' },
        { key: '7', text: 'Week', value: '5' },
        { key: '14', text: '2 weeks', value: '14' }
    ],
    placeType: "places",
    ordering: "relevance",
    ordering_options: [ "relevance", "vibe", "distance", "rating", "hours" ],
    numTopPicks: 10,
    searchTerm: "",
    selected_activity: Constants.main_categories[0],
    totalPages: 5
}

export const nav = (state = initialState, action) => {
    //console.log('SET_REDUX_STATE: ', action)
    
    switch (action.type) {
        case 'SET_ACTIVITY': 
            let activity = action.activity
            if (action.activity === "any") action.activity = null

            const all_categories = Constants.activty_categories.concat(Constants.main_categories)
            let selected_activity = all_categories.find(({ key }) => key === activity)

            if (selected_activity === undefined) selected_activity = Constants.main_categories[0]

            return {
                ...state,
                activity: activity,
                selected_activity: selected_activity
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
            action.location.latitude = parseFloat(action.location.latitude)
            action.location.longitude = parseFloat(action.location.longitude)
                
            return {
                ...state,
                currentLocation: action.location
            }
        
        case 'SET_HAS_LOCATION':
            console.log('SET_HAS_LOCATION', action.hasLocation)

            return {
                ...state,
                hasLocation: action.hasLocation
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

        case 'SET_ORDERING':
            return {
                ...state,
                ordering: action.ordering
            }

        case 'SET_PLACE_TYPE':
            return {
                ...state,
                placeType: action.type
            }
        
        case 'SET_SEARCH_TERM':
            console.log('SET_SEARCH_TERM: ', action.searchTerm)
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
            console.log("SET_VIBES: ", action.vibes)

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
