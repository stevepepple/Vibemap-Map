import { detailShown } from "./reducer";

export const setUIState = state => ({
  type: 'SET_UI_STATE',
  state,
});

export const setDetailsShown = show => ({
  type: 'SET_DETAILS_SHOWN',
  show,
});

export const setDetailsId = id => ({
  type: 'SET_DETAILS_ID',
  id,
});

export const activateGeod = geod => ({
  type: 'ACTIVATE_GEOD',
  geod,
});

export const setCurrentLocation = location => ({
  type: 'SET_CURRENT_LOCATION',
  location,
});

export const setZoom = zoom => ({
  type: 'SET_ZOOM',
  zoom,
});

export const setDistance = distance => ({
  type: 'SET_DISTANCE',
  distance,
});

export const setDays = days => ({
  type: 'SET_DAYS',
  days,
});

export const setSearchTerm = term => ({
  type: 'SET_SEARCH_TERM',
  term,
});

export const setCurrentVibes = vibes => ({
  type: 'SET_CURRENT_VIBES',
  vibes,
});

export const setEventLocation = location => ({
  type: 'SET_EVENT_LOCATION',
  location,
});

export const setEventsData = events_data => ({
  type: 'SET_EVENTS_DATA',
  events_data,
});

export const setPlacesData = places_data => ({
  type: 'SET_PLACES_DATA',
  places_data,
});

export const setNearbyPlaces = places => ({
  type: 'SET_NEARBY_PLACES',
  places,
});

export const setName = name => ({
  type: 'SET_NAME',
  name
})

export const closeGeod = () => ({
  type: 'CLOSE_GEOD',
});