import "isomorphic-fetch";

import store from './configureStore'

// Use Thunks with Vibemap service
import VibeMap from '../services/VibeMap.js'
import { isBrowser } from "./reducers";

export const addFeature = feature => ({ type: 'ADD_FEATURE', feature })

export const setIsBrowser = isBrowser => ({ type: 'SET_IS_BROWSER', isBrowser })

export const setDetailsShown = show => ({ type: 'SET_DETAILS_SHOWN', show })
export const setSavedPlaces = savedPlaces => ({ type: 'SET_SAVED_PLACES', savedPlaces })

export const setShowList = show => ({ type: 'SET_SHOW_LIST', show })

// Map Actions
// Reducers are in map.reducers
export const setBearing = bearing => ({ type: 'SET_BEARING', bearing })
export const setBounds = bounds => ({ type: 'SET_BOUNDS', bounds })
export const setBoundsReady = boundsReady => ({ type: 'SET_BOUNDS_READY', boundsReady })
export const setDensityBonus = densityBonus => ({ type: 'SET_DENSITY_BONUS', densityBonus })
export const setDistance = distance => ({ type: 'SET_DISTANCE', distance })
export const setLayersChanged = changed => ({ type: 'SET_LAYERS_CHANGED', changed })
export const setMapReady = mapReady => ({ type: 'SET_MAP_READY', mapReady })
export const setMapSize = mapSize => ({ type: 'SET_MAP_SIZE', mapSize })
export const setPixelDistance = pixelDistance => ({ type: 'SET_PIXEL_DISTANCE', pixelDistance })
export const setViewport = viewport => ({ type: 'SET_VIEWPORT', viewport })
export const setZoom = zoom => ({ type: 'SET_ZOOM', zoom })

// Navigation Actions
// Reducers are in nav.reducers
export const setAllCategories = allCategories => ({ type: 'SET_ALL_CATEGORIES', allCategories })
export const setAllCities = allCities => ({ type: "SET_ALL_CITIES", allCities });
export const setAllVibes = allVibes => ({ type: 'SET_ALL_VIBES', allVibes })
export const setActivity = activity => ({ type: 'SET_ACTIVITY', activity })
export const setCurrentLocation = location => ({ type: 'SET_CURRENT_LOCATION', location })
export const setCurrentPage = page => ({ type: 'SET_CURRENT_PAGE', page })
export const setDays = days => ({ type: 'SET_DAYS', days })
export const setMainVibe = vibe => ({ type: 'SET_MAIN_VIBE', vibe })
export const setPlaceType = (value) => ({ type: 'SET_PLACE_TYPE', value })
export const setSearchTerm = searchTerm => ({ type: 'SET_SEARCH_TERM', searchTerm })
export const setVibes = vibes => ({ type: 'SET_VIBES', vibes })
export const setVibesets = vibesets => ({ type: 'SET_VIBESETS', vibesets })
export const setTopVibes = top_vibes => ({ type: 'SET_TOP_VIBES', top_vibes })
export const setTotalPages = pages => ({ type: 'SET_TOTAL_PAGES', pages })

export const citiesError = () => ({ type: "CITIES_ERROR" });


// Nav Thunks
export const fetchCategories = () => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      VibeMap.getCategories().then(results => {
        dispatch(setAllCategories(results.data['place_categories']))
        resolve(results)
      })
    })
  }
}

export const fetchCities = () => (dispatch, getState) => {
  return new Promise(resolve => {
    VibeMap.getCities()
      .then(response => response.data)
      .then(cities => {
        dispatch(setAllCities(cities))
        resolve(cities)
      })
      .catch(err => dispatch(citiesError(err)))
  })
}

// Place Actions
export const detailsRequest = () => ({ type: "DETAILS_LOADING" });
export const detailsReceived = details => ({ type: "DETAILS_SUCCESS", payload: details });
export const detailsError = () => ({ type: "FETCH_DETAILS_FAILURE" });
export const setCurrentItem = place => ({ type: 'SET_CURRENT_ITEM', place })
export const setDetailsLoading = detailsLoading => ({ type: "SET_DETAILS_LOADING", detailsLoading });

export const setPlacesLoading = placesLoading => ({ type: 'SET_PLACES_LOADING', placesLoading })
export const setPlacesError = error => ({ type: 'SET_PLACES_ERROR', error })

// Get Place Details
export const fetchDetails = (id, type) => (dispatch, getState) => {
  return new Promise(resolve => {
    //dispatch(detailsRequest())

    VibeMap.getPlaceDetails(id, type)
      .then(response => response.data)
      .then(details => {
        resolve(details)

        console.log('DISPATCH DETAILS RECIEVED: ', details.properties)
        dispatch(detailsReceived(details))
        dispatch(setDetailsLoading(false))

        
      })
      .catch(err => dispatch(detailsError(err)))
  })
}

export const clearDetails = () => (dispatch, getState) => {
  dispatch(setDetailsId(null))
  dispatch(setDetailsType(null))
  dispatch(setDetailsShown(false))
}

// Dispatch is called in getInitialProps of Details
// args: 
export const fetchPlaces = (point = [0, 0], distance, bounds, activity = 'all', days, vibes, searchTerm, currentTime, refreshResults) => (dispatch, getState) => {

  const { savedPlaces } = getState()

  dispatch(setPlacesLoading(true))

  const should_search = vibes.length > 0 || searchTerm !== ""
  
  return new Promise(resolve => {
    console.log('Should search: ', should_search)
    
    // Do a Specific Search
    if (should_search) {
      // Search for top picks...
      VibeMap.getPicks(point, distance, bounds, activity, days, vibes, searchTerm)
        .then(response => {
          const results = response.data

          // Set Data with minor side effects
          if (results && results.length > 0) {
            // Set places in he results
            console.log('setTopPlaces: ', refreshResults)
            dispatch(setTopPlaces(results, refreshResults))
            dispatch(setPlacesLoading(false))
          } else {
            // TODO: Add dispatch for API errors
            console.log('Error or no results. See in Redux state', results)
          }
        }, (error) => {
          console.log(error)
        })
    }

    
    // Vibemap service handles the logic and data wranggling
    // This module shoudl just get and set
    VibeMap.getPlaces(point, distance, bounds, activity, days, vibes, searchTerm)
      .then(response => {
        const results = response.data

        if (results && results.length > 0) {

          // Set Data with minor side effects
          // Like check against local storage for saved places.
          let withSavedPlaces = results.map((place) => {
            const foundIndex = savedPlaces.findIndex(obj => obj.id === place.id) 
            place.properties.is_saved = (foundIndex > -1) ? true : false          
            return place
          })

          dispatch(setPlacesData(withSavedPlaces, refreshResults))
          dispatch(setDensityBonus(response.density_bonus))
          dispatch(setPlacesLoading(false))

          if (should_search === false) dispatch(setTopPlaces(results, refreshResults))

        } else {
          console.log('Error or no results. See in Redux state', response)
        }

        // Return to component promise
        resolve(results)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

export const setTopPlaces = (results, refreshResults) => (dispatch, getState) =>{
  // Handle Pagination from State
  const { currentPage, numTopPicks, clusterSize } = getState().nav

  const first = currentPage * numTopPicks
  const last = first + numTopPicks

  const top_picks = results.splice(first, last)
  const num_results = results.length
  const num_pages = Math.floor(num_results / numTopPicks) - 1

  const top_picks_clustered = VibeMap.clusterPlaces(top_picks, clusterSize)

  // TODO: dynamic value for merge top
  dispatch(setTopPicks(top_picks_clustered, refreshResults))
  dispatch(setTotalPages(num_pages))

}

export const handleSavedPlace = (place) => (dispatch, getState) => {

  return new Promise(resolve => {
    const { savedPlaces, topPicks } = getState()
    console.log('Save place', place.id, place, savedPlaces)

    const foundIndex = savedPlaces.findIndex(obj => obj.id === place.id)
    let isSaved = (foundIndex > -1) ? true : false

    let updateSavedPlace = savedPlaces
    let updateTopPicks = topPicks

    if (isSaved) {
      updateSavedPlace.splice(foundIndex, 1)
      console.log('REMOVED item from saved places', savedPlaces)
    } else {
      // TODO: update top picks? 
      console.log('Should update top picks? ', topPicks)      
      updateSavedPlace.push(place)
    }

    dispatch(setSavedPlaces(updateSavedPlace))

    const foundInPicks = updateTopPicks.findIndex(obj => obj.id === place.id)
    if (foundInPicks > -1) {
      updateTopPicks[foundInPicks].properties.is_saved = !isSaved

      console.log('Found in Top Picks: ', isSaved, updateTopPicks[foundInPicks])

      dispatch(setTopPicks(updateTopPicks))

    }


    resolve(isSaved)
  
  })

}


export const fetchVibes = () => {
  return (dispatch, getState) => {
    return new Promise(resolve => {

      VibeMap.getVibes().then(results => {
        //return console.log('fetchVibes...', results)
        dispatch(setVibesets(results.data['signature_vibes']))
        dispatch(setAllVibes(results.data['all_vibes']))
        resolve(results)
      })
    })
  } 
}  

// Dispatch is called in getInitialProps of Details
export const getDetails = (id, type) => {

  return new Promise(resolve => {
    VibeMap.getPlaceDetails(id, type)
      .then(response => response.data)
      .then(details => resolve(details))
  })
}


export const setDetailsId = id => ({ 
  type: 'SET_DETAILS_ID', 
  id 
})

export const setDetailsType = place_type => ({ 
  type: 'SET_DETAILS_TYPE', 
  place_type 
})

export const setGuideDetails = details => ({ 
  type: 'SET_GUIDE_DETAILS', 
  details 
})

export const setGuideMarkers = markers => ({ 
  type: 'SET_GUIDE_MARKERS', 
  markers 
})

export const activateGeod = geod => ({
  type: 'ACTIVATE_GEOD',
  geod,
})

export const setHeaderSize = size => ({
  type: 'SET_HEADER_SIZE',
  size,
})

export const setWindowSize = size => ({  
  type: 'SET_WINDOW_SIZE',
  size,
})

export const setLayers = layers => ({
  type: 'SET_LAYERS',
  layers,
})


export const setEventLocation = location => ({
  type: 'SET_EVENT_LOCATION',
  location,
})

export const setEventsData = events_data => ({
  type: 'SET_EVENTS_DATA',
  events_data,
})

export const setCities = cities => ({
  type: 'SET_CITIES',
  cities,
})

export const setNeighborhoods = cities => ({
  type: 'SET_NEIGHBORHOODS',
  cities,
})

export const setPlacesData = (places_data, refreshResults) => ({
  type: 'SET_PLACES_DATA',
  places_data,
  refreshResults
})

export const setTopPicks = (places_data, refreshResults, mergeTopPicks) => ({
  type: 'SET_TOP_PICKS_DATA',
  places_data,
  refreshResults,
  mergeTopPicks
})

export const setNearbyPlaces = places => ({
  type: 'SET_NEARBY_PLACES',
  places,
})

export const setName = name => ({
  type: 'SET_NAME',
  name
})

export const closeGeod = () => ({
  type: 'CLOSE_GEOD',
})