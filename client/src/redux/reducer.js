import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import _ from 'lodash'

import queryString from 'query-string'

export function uiReducer(state = uiState, action) {
  switch(action.type) {
    
  }
}

// reducer takes state and action (in our a javascript object) as parameters
// then returns a state
export const uiState = (state = {}, action) => {
  if (action.type == 'SET_UI_STATE') {
    console.log("Setting initial Redux state with: ", action)
    state = action.state
  }
  return state
}

export const detailsShown = (state = false, action) => {
  if (action.type == 'SET_DETAILS_SHOWN') {
    state = action.show
  }
  return state
}

export const detailsId = (state = null, action) => {
  if (action.type == 'SET_DETAILS_ID') {
    console.log("SET_DETAILS_ID: " + action.id)
    state = action.id
  }
  return state
}

export const activity = (state = "", action) => {
  if (action.type == 'SET_ACTIVITY') {
    if (action.activity == "all"){
      action.activity = null
    }
    state = action.activity
  }
  return state
}

// reducer takes state and action (in our a javascript object) as parameters
// then returns a state
export const currentLocation = (state = { latitude: 0, longitude: 0 }, action) => {
  if (action.type == 'SET_CURRENT_LOCATION') {
    action.location.latitude = parseFloat(action.location.latitude)
    action.location.longitude = parseFloat(action.location.longitude)
    state = action.location
  }
  return state
}

export const bearing = (state = 0, action) => {
  if (action.type == 'SET_BEARING') {
    console.log("SET BEARING: ", action.bearing)
    state = action.bearing
  }
  return state
}

export const zoom = (state = 14, action) => {
  if (action.type == 'SET_ZOOM') {
    state = action.zoom
  }
  return state
}

// TODO: create a mathematical relationship between zoom and distance
export const distance = (state = 1.4, action) => {
  if (action.type == 'SET_DISTANCE') {
    state = action.distance
  }
  return state
}

// Default state is one day
export const currentDays = (state = 1, action) => {
  if (action.type == 'SET_DAYS') {
    console.log('Setting Days ', action)
    state = action.days
  }
  return state
}

// Default state is one day
export const searchTerm = (state = "", action) => {
  if (action.type == 'SET_SEARCH_TERM') {
    state = action.term
  }
  return state
}

export const currentVibes = (state = ['chill'], action) => {
  if (action.type == 'SET_CURRENT_VIBES') {
    state = action.vibes
  }
  return state
}

/* TODO: Read from API or YAML
export const vibeCategories = (
vibe_categories: ['adventurous', 'artsy', 'authentic', 'civic', 'chill', 'cozy', 'creative', 'energetic', 'exclusive', 'festive', 'free', 'friendly', 'healthy', 'local', 'romantic', 'interactive', 'inspired', 'vibrant', 'lively', 'outdoors', 'scenic', 'positive', 'unique']
) */


export const nearby_places = (state = [], action) => {
  if (action.type == 'SET_NEARBY_PLACES') {
    let data = []

    let places = action.places
    /*
    let places = GeoJSON.parse(action.places, { Point: ['latitude', 'longitude'] });
    console.log('Nearby Places to GEOJSON :', places)

    places.features.forEach(venue => {

        request.post('http://localhost:5000/api/places', {form: venue}, 
            function(err,httpResponse,body){ 
                if (err) {
                    console.log(err);
                } else {
                    //console.log('Saved venue: ', body)
                }
        })
        
    });
    */

    state = places
  }
  return state
}

export const cities = (state = [], action) => {

  if (action.cities == 'SET_CITIES') {
    // Save the processed data to state.
    return action.cities
  }

  return state
}

export const neighborhoods = (state = [], action) => {

  if (action.neighborhoods == 'SET_NEIGHBORHOODS') {
    // Save the processed data to state.
    return action.neighborhoods
  }

  return state
}

export const eventsData = (state = [], action) => {

  if (action.type == 'SET_EVENTS_DATA') {
    // TODO: Map and process, but plan to move this logic to API
    let processed = action.events_data.map(event => {
      event.properties.score = event.properties.likes
      return event
    })

    // Save the processed data to state.
    state = processed    
  }

  return state
}

export const placesData = (state = [], action) => {

  if (action.type == 'SET_PLACES_DATA') {
    // TODO: Map and process, but plan to moe this logic to API
    let processed = action.places_data.map(place => {
      // TODO: Score places with more categories higher
      //console.log("categories: ", place.properties.categories)
      // TODO: work with Cory to fix 
      //console.log(place.properties.categories)
      //if (place.properties.categories.length > 1) 
      place.properties.sub_categories = place.properties.categories
      place.properties.categories = place.properties.sub_categories[0]
      //event.properties.score = event.properties.likes
      return place
    })
    
    // If request is for fresh results update the map.
    // Otehrwise, merge the results
    if(action.refreshResults) {
      state = processed
    } else {
      var merged = _.unionBy(state, processed, 'id')
      state = merged
    }
    
    console.log("How many total places: ", state.length)
    
  }

  return state
}

export const topPicks = (state = [], action) => {

  if (action.type == 'SET_TOP_PICKS_DATA') {
    // TODO: Map and process, but plan to moe this logic to API
    let processed = action.places_data.map(place => {
      // TODO: work with Cory to fix these categories according to the schema
      place.properties.sub_categories = place.properties.categories
      place.properties.top_vibe = null
      if (place.properties.vibes.length > 0) {
        place.properties.top_vibe = place.properties.vibes[0]
      }

      if (place.properties.sub_categories && place.properties.sub_categories.length > 0) {
        place.properties.categories = place.properties.sub_categories[0]  
      }
      
      return place
    })

    // Save the processed data to state.
    state = processed
  }

  return state
}

// TODO: Remove; This is just a test
export const name = (state = 'Steve', action) => {
  
  switch (action.type) {
    case 'SET_NAME':
      return action.name;
    case 'REMOVE_NAME':
      return null;
    default:
      return state;
  }
}


export const geod = (state = {}, action) => {

  switch (action.type) {
    case 'ACTIVATE_GEOD':
      return action.geod;
    case 'CLOSE_GEOD':
      return {};
    default:
      return state;
  }

}

export const reducers = (history) => combineReducers({
  activity,
  bearing,
  cities,
  geod,
  router: connectRouter(history),
  currentLocation,
  currentDays,
  currentVibes,
  detailsId,
  detailsShown,
  distance,
  name,
  eventsData,
  nearby_places,
  placesData,
  searchTerm,
  topPicks,
  uiState,
  zoom
});