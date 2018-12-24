import { combineReducers } from 'redux';
import GeoJSON from 'geojson';

// reducer takes state and action (in our a javascript object) as parameters
// then returns a state

export const current_location = (state = {}, action) => {
  if (action.type == 'SET_CURRENT_LOCATION') {
    state = action.location
  }
  return state
} 

export const nearby_places = (state = [], action) => {
  if (action.type == 'SET_NEARBY_PLACES') {
    let data = [];

    action.places.map((place) => {
      place = place.venue
      place.lat = place.location.lat
      place.lng = place.location.lng
      data.push(place)
    })

    let places = GeoJSON.parse(data, { Point: ['lat', 'lng'] });
    console.log('Nearby Places :', places)

    state = places
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
  current_location,
  name,
  nearby_places
});