import { combineReducers } from 'redux';
import GeoJSON from 'geojson';
import request from 'request-promise'

import helpers from '../helpers.js'


const uiState = {

}

export function uiReducer(state = uiState, action) {
  switch(action.type) {
    
  }
}

// reducer takes state and action (in our a javascript object) as parameters
// then returns a state
export const currentLocation = (state = {}, action) => {
  if (action.type == 'SET_CURRENT_LOCATION') {
    console.log("Setting Redux state with Location ", action.location)
    state = action.location
  }
  return state
}

export const currentZoom = (state = {}, action) => {
  if (action.type == 'SET_ZOOM') {
    console.log("Setting Redux state with zoom: ", action.zoom)
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

export const currentDays = (state = 2, action) => {
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
  nearby_places
});