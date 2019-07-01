import { combineReducers } from 'redux';
import GeoJSON from 'geojson';
import request from 'request-promise'

import helpers from '../helpers.js'


// reducer takes state and action (in our a javascript object) as parameters
// then returns a state

export const current_location = (state = {}, action) => {
  if (action.type == 'SET_CURRENT_LOCATION') {
    state = action.location
  }
  return state
}

export const current_vibes = (state = {}, action) => {
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
  current_vibes,
  name,
  nearby_places
});