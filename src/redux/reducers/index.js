import { combineReducers } from 'redux'

// TODO: Load only the package from NPM
import unionBy from 'lodash.unionby'
import helpers from '../../helpers'

import initialGuides from '../guides.json'

// Load organized reducers
// reducer takes state and action (in our a javascript object) as parameters
import editor from './editor.reducers'
import map from './map.reducers'
import nav from './nav.reducers'
import places from './places.reducers'

// Global State
// TODO: Make loading page specific
export const loading = (state = false, action) => {
  if (action.type === 'SET_LOADING') {
    state = action.state
  }
  return state
}

export const detailsShown = (state = false, action) => {
  if (action.type === 'SET_DETAILS_SHOWN') {
    state = action.show
  }
  return state
}

export const isBrowser = (state = false, action) => {
  if (action.type === 'SET_IS_BROWSER') {
    state = action.isBrowser
  }
  return state
}

export const showList = (state = true, action) => {
  if (action.type === 'SET_SHOW_LIST') {
    state = action.show
  }
  return state
}

export const detailsId = (state = null, action) => {
  if (action.type === 'SET_DETAILS_ID') {
    state = action.id
  }
  return state
}

export const detailsType = (state = "place", action) => {
  if (action.type === 'SET_DETAILS_TYPE') {
    console.log("SET_DETAILS_TYPE: ", action.place_type)
    state = action.place_type
  }
  return state
}

export const language = (state = "en", action) => {
  if (action.type === 'SET_LANGUAGE') {
    state = action.language
  }
  return state
}


export const windowSize = (state = { width: 1024, height: 768 }, action) => {
  if (action.type === 'SET_WINDOW_SIZE') {
    //console.log("Set windows size: ", action.size)
    state = action.size
  }
  return state
}

export const headerSize = (state = { width: 0, height: 0 }, action) => {
  if (action.type === 'SET_HEADER_SIZE') {
    state = action.size
  }
  return state
}

// One of events, places, or guides
export const placeType = (state = 'places', action) => {
  if (action.type === 'SET_PLACE_TYPE') {
    //console.log("SET_PLACE_TYPE", action)
    state = action.value
  }
  return state
}

export const topVibes = (state = [], action) => {
  if (action.type === 'SET_TOP_VIBES') {
    state = action.top_vibes
  }
  return state
}

/* TODO: Read from API or YAML
export const vibeCategories = (
vibe_categories: ['adventurous', 'artsy', 'authentic', 'civic', 'chill', 'cozy', 'creative', 'energetic', 'exclusive', 'festive', 'free', 'friendly', 'healthy', 'local', 'romantic', 'interactive', 'inspired', 'vibrant', 'lively', 'outdoors', 'scenic', 'positive', 'unique']
) */
export const nearby_places = (state = [], action) => {
  if (action.type === 'SET_NEARBY_PLACES') {

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

export const neighborhoods = (state = [], action) => {

  if (action.type === 'SET_NEIGHBORHOODS') {
    // Save the processed data to state.
    return action.neighborhoods
  }

  return state
}

export const eventsData = (state = [], action) => {

  if (action.type === 'SET_EVENTS_DATA') {
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

export const guidesData = (state = initialGuides['results']['features'], action) => {
  if (action.type === 'SET_GUIDES_DATA') {
    return action.guides_data
  }

  return state
}

export const guideDetails = (state = {}, action) => {
  if (action.type === 'SET_GUIDE_DETAILS') {
    return action.details
  }

  return state
}

export const guideMarkers = (state = [], action) => {
  if (action.type === 'SET_GUIDE_MARKERS') {
    return action.markers
  }

  return state
}

export const placesData = (state = [], action) => {

  if (action.type === 'SET_PLACES_DATA') {
    // TODO: Map and process, but plan to moe this logic to API
    let processed = action.places_data.map(place => {

      // TODO: Score places with more categories higher
      //console.log("categories: ", place.properties.categories) 

      // TODO: Figure out a way to replace this with a much smaller look up and mapping
      let matches = helpers.getCategoryMatch(place.properties.categories)
      
      if (matches.length === 0) matches.push('missing')

      place.properties.categories = matches[0]
      //event.properties.score = event.properties.likes
      return place
    })
    
    // If request is for fresh results update the map.
    // Otehrwise, merge the results
    if(action.refreshResults) {
      state = processed
    } else {
      var merged = unionBy(state, processed, 'id')
      state = merged
    }
    
    //console.log("How many total places: ", state.length)
    
  }

  return state
}


export const topPicks = (state = [], action) => {

  if (action.type === 'SET_TOP_PICKS_DATA') {
    // Save the processed data to state.
    // If request is for fresh results update the map.
    // TODO: Map and process, but plan to moe this logic to API
    let processed = action.places_data.map(place => {
      // TODO: work with Cory to fix these categories according to the schema
      place.properties.sub_categories = place.properties.categories
      place.properties.top_vibe = null

      // Give every point a cluster attribute. 
      place.properties.cluster = null
      if (place.properties.vibes.length > 0) {
        place.properties.top_vibe = place.properties.vibes[0]
      }

      if (place.properties.sub_categories && typeof (place.properties.sub_categories) == 'object' && place.properties.sub_categories.length > 0) {
        place.properties.categories = place.properties.sub_categories[0]
      }

      return place
    })

    if (action.refreshResults === false || action.mergeTopPicks === true) {
      var merged = unionBy(state, processed, 'id')
      let merged_sorted = merged.sort((a, b) => b.properties.average_score - a.properties.average_score)
      state = merged_sorted

    } else {
      state = processed

    }
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

const rootReducer = combineReducers({
  // Module reducers
  editor,
  map,
  nav,
  places,
  // And general ones
  detailsType,
  detailsShown,
  eventsData,
  guidesData,
  guideDetails,
  guideMarkers,
  headerSize,
  isBrowser,
  language, 
  name,
  nearby_places,
  placesData,
  placeType,
  showList,
  topPicks,
  topVibes,
  windowSize
})

export default rootReducer