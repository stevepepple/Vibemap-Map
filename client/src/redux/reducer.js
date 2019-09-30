import { combineReducers } from 'redux'

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

// reducer takes state and action (in our a javascript object) as parameters
// then returns a state
export const currentLocation = (state = {}, action) => {
  if (action.type == 'SET_CURRENT_LOCATION') {
    state = action.location
  }
  return state
}

export const currentZoom = (state = 14, action) => {
  if (action.type == 'SET_ZOOM') {
    state = action.zoom
  }
  return state
}

// TODO: create a mathematical relationship between zoom and distance
export const currentDistance = (state = {}, action) => {
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

export const currentVibes = (state = {}, action) => {
  if (action.type == 'SET_CURRENT_VIBES') {
    state = action.vibes
    console.log("SET CURRENT VIBES: ", action.vibes)
  }
  return state
}

export const nearby_places = (state = [], action) => {
  if (action.type == 'SET_NEARBY_PLACES') {
    let data = [];

    console.log('SET NEARBY PLACES ', action.places)
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
      place.properties.categories = place.properties.categories.shift();
      //event.properties.score = event.properties.likes
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

};

export const reducers = combineReducers({
  geod,
  currentLocation,
  currentZoom,
  currentDistance,
  currentDays,
  currentVibes,
  name,
  eventsData,
  nearby_places,
  placesData,
  uiState
});