const initialState = {
    loading: false,
    bearing: 0,
    bounds: [],
    boundsReady: false,
    densityBonus: 0.2,
    distance: 1.4,
    geod: {},
    layers: { 
        clusters: false, 
        heatmap: true, 
        neighborhoods: true, 
        places_markers: true, 
        photo_markers: true 
    },
    layersChanged: false,
    mapReady: false,
    mapSize: { width: 800, height: 600 },
    pixelDistance: 0,
    viewport: {},
    zoom: 14
}

const map = (state = initialState, action) => {
    //console.log('Map Reducer: ', action.type, action)
    switch (action.type) {
        // TODO: Do we need loading state per end point. 
        case "SET_MAP_READY":
            return {
                ...state,
                mapReady: action.mapReady,
            }

        case "SET_BEARING":
            return {
                ...state,
                bearing: action.bearing,
            }

        case "SET_BOUNDS":
            return {
                ...state,
                bearing: action.bounds,
            }

        case "SET_BOUNDS_READY":
            return {
                ...state,
                boundsReady: action.boundsReady,
            }

        case "SET_DENSITY_BONUS":
            return {
                ...state,
                densityBonus: action.densityBonus,
            }

        case "SET_DISTANCE":
            return {
                ...state,
                distance: action.distance,
            }

        case "SET_LAYERS":
            // Always change he state to the opposite.
            return {
                ...state,
                layers: action.layers,
            }
        case "SET_LAYERS_CHANGED":
            // Always change he state to the opposite.
            return {
                ...state,
                layersChanged: !state.layersChanged,
            }

        case "SET_MAP_SIZE":
            return {
                ...state,
                mapSize: action.mapSize,
            }

        case "SET_PIXEL_DISTANCE":
            return {
                ...state,
                pixelDistance: action.pixelDistance,
            }

        case "SET_VIEWPORT":
            return {
                ...state,
                viewport: action.viewport,
            }

        case "SET_ZOOM":
            return {
                ...state,
                zoom: action.zoom,
            }

        default:
            return state;

    }
}

export default map;
