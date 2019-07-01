
export const activateGeod = geod => ({
  type: 'ACTIVATE_GEOD',
  geod,
});

export const setCurrentLocation = location => ({
  type: 'SET_CURRENT_LOCATION',
  location,
});

export const setCurrentVibes = vibes => ({
  type: 'SET_CURRENT_VIBES',
  vibes,
});

export const setEventLocation = location => ({
  type: 'SET_EVENT_LOCATION',
  location,
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