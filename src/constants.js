export const SET_ACTIVE_OPTION = 'SET_ACTIVE_OPTION'

export const MAPBOX_STYLE = 'mapbox://styles/stevepepple/cka8kdq0i1dvv1it9nj0l70xn/draft?optimize=true'

export const MAPBOX_STYLE_LIGHT = 'mapbox://styles/stevepepple/ck8unzpvf0z5j1itdntgz3lxp'

export const DATABASE = 'mongodb://stevepepple:Hotspot1@ds019101.mlab.com:19101/hotspots'

export const TIMEOUT = 8000;

export const METERS_PER_MILE = 1609.34

export const PURPLE = '#811897'

export const TRUCATE_LENGTH = 18

export const HEATMAP_INTENSITY = 0.1

export const RECOMMENDATION_REASONS = {
    'events': 'This place is happening',
    'rating' : 'People like this spot',
    'vibe': 'Totally your vibe',
    'distance': 'Good bet near you',
}

export const zoom_levels = {
    0: 'World ~ 1:500 M',
    1: 'Continent ~ 1:250 M',
    2: 'Subcontinental ~ 1:150 M',
    3: 'Largest country ~ 1:70 M',
    4: 'Large country ~ 1:35 M',
    5: 'African country ~ 1:15 M',
    6: 'Large European country ~ 1:10 M',
    7: 'Large US state ~ 1:4 M',
    8: 'Small US state ~ 1:2 M',
    9: 'Large metro ~ 1:1 M',
    10: 'Small metro ~ 1:500 K',
    11: 'City ~ 1:250 K',
    12: 'Town ~ 1:150 K',
    13: 'Village ~ 1:70 K',
    14: 'Neighborhood ~ 1:35 K',
    15: 'Small road ~ 1:15 K',
    16: 'Street ~ 1:8 K',
    17: 'Block ~ 1:4 K',
    18: 'Buildings & trees ~ 1:2 K',
    19: 'Street detail ~ 1:1 K',
    20: 'Rooftop ~ 1:1 K'
}

export const main_categories = [
    // Going Out
    { key: 'all', value: 'all', text: 'Categories', label: { icon: 'building', circular: true }, categories: ['art', 'arts', 'books', 'comedy', 'community', 'culture', 'free', 'health', 'local', 'nightlife', 'recurs', 'romance', 'urban'] },
    // Eating
    { key: 'food', value: 'food', text: 'Eating', label: { icon: 'food', circular: true }, categories: ['food', 'restuarant'] },
    // Drinking
    { key: 'drinking', value: 'drinking', text: 'Drinking', label: { icon: 'glass martini', circular: true }, categories: ['drinking', 'drinks'] },
    // Music
    // Shopping
    { key: 'shopping', value: 'shopping', text: 'Shopping', label: { icon: 'shopping bag', circular: true }, categories: ['shopping'] },    
]

export const activty_categories = [
    { key: 'arts', value: 'arts', text: 'Arts', label: { icon: 'paint brush', circular: true }, categories: ['art', 'arts', 'craft', 'dance', 'immersive', 'performance'] },
    { key: 'comedy', value: 'comedy', text: 'Comedy & Storyteling', label: { icon: 'microphone', circular: true }, categories: ['community']},
    { key: 'community', value: 'community', text: 'Community', label: { icon: 'heart', circular: true }, categories: ['comedy', 'storytelling'] },
    { key: 'health', value: 'health', text: 'Immersive', label: { icon: 'medkit', circular: true }, categories: ['health'] },
    //{ key: 'immersive', value: 'immersive', text: 'Immersive', categories: ['immersive'] },
    { key: 'learning', value: 'learning', text: 'Learning', label: { icon: 'book', circular: true }, categories: ['learning', 'education'] },    
    { key: 'music', value: 'music', text: 'Music', label: { icon: 'music', circular: true }, categories: ['music'] },
    { key: 'outdoors', value: 'outdoors', text: 'Outdoors', label: { icon: 'tree', circular: true }, categories: ['outdoors'] },
    { key: 'games', value: 'games', text: 'Games & Sports', label: { icon: 'table tennis', circular: true }, categories: ['games', 'sports'] },
    { key: 'style', value: 'style', text: 'Style & Fashion', label: { icon: 'cut', circular: true }, categories: ['style', 'fashion'] }
    //{ key: 'spiritual', value: 'spiritual', text: 'Spiritual', categories: ['spirtual'] },
    //{ key: 'transit', value: 'transit', text: 'transit', categories: ['transit'] }   
]

// Groupings for All Place Categories
// TODO: Sync these with YAML categories from API
export const place_categories = [
    { key: 'any', value: 'any', text: 'All Activities', categories: ['Arts & Entertainment', 'Food', 'Bar'] },
    { key: 'cafe', value: 'cafe', text: 'Cafe'},
    { key: 'comedy', value: 'comedy', text: 'Comedy' },
    { key: 'community', value: 'community', text: 'Community' },
    { key: 'food', value: 'food', text: 'Eating', categories: ['Food'] },
    { key: 'drinking', value: 'drinking', text: 'Drinking', categories: ['Bar', 'Brewery', 'Lounge'] },
    { key: 'health', value: 'health', text: 'Health' },
    { key: 'shopping', value: 'shopping', text: 'Shopping', categories: ['Shop & Service'] },
    { key: 'art', value: 'art', text: 'Arts', categories: ['Arts & Entertainment'] },
    { key: 'music', value: 'music', text: 'Music', categories: ['Music Venue', 'Performing Arts Venue', 'Nightclub', 'Concert Hall', 'Music Festival', 'Music Schools', 'Music Stores', 'Country Dance Club', 'Dance Studio', 'Salsa Club', 'Samba School', 'Recording Studios', 'Bar'] },
    { key: 'comedy', value: 'comedy', text: 'Stories & Laughing', categories: ['Comedy Club', 'Bar', 'Nightclub'] },
    { key: 'games', value: 'games', text: 'Games & Sports', categories: ['Outdoors & Recreation'] },
    { key: 'learning', value: 'learning', text: 'Learning', categories: ['College & University'] },
    { key: 'immersive', value: 'immersive', text: 'Immersive', categories: ['Arts & Entertainment'] },
    { key: 'outdoors', value: 'outdoors', text: 'Outdoors', categories: ['Outdoors & Recreation', 'Zoo'] },
    { key: 'spirtual', value: 'spirtual', text: 'Spirtual', categories: ['spirtual'] },
    { key: 'san-francisco-bart', value: 'BART', text: 'BART', categories: ['transit'] },
    { key: 'hotel', value: 'hotel', text: 'hotel', categories: ['hotel'] }
]
