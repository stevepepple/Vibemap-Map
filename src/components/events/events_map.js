import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import isEqual from 'react-fast-compare'
import * as actions from '../../redux/actions'

import { featureCollection, point } from '@turf/helpers'
import distance from '@turf/distance'
import truncate from '@turf/truncate'

import ReactMapGL, { Source, Layer, NavigationControl, GeolocateControl, Marker, Popup, ScaleControl } from 'react-map-gl'
import CustomMapController from '../map/map-conroller'
import { WebMercatorViewport } from 'react-map-gl';

import { Search } from 'semantic-ui-react'

// TODO: Remove these other map sources
import Styles from '../../styles/map_styles.js'
import Markers from '../map/markers'
import Selected from '../map/selected'
import VectorTile from '../map/VectorTile'
import LayersFilter from '../map/LayersFilter'
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from '../map/layers'
//import YouAreHere from '../map/you_are_here.js'

import AllVibes from '../elements/AllVibes'
import ZoomLegend from '../map/ZoomLegend'

// TODO: load from common .env
import * as Constants from '../../constants.js'
import helpers from '../../helpers.js'

import '../../styles/map.scss'

import { withRouter, Link } from 'react-router-dom';
import qs from 'qs'

class EventsMap extends React.Component {

    constructor(props) {
        super(props)

        // TODO: Move to database or it's own repository
        this.state = {
            lens : {"type": "FeatureCollection", "features": []},
            popupInfo: null,
            has_data: false,
            has_marker_data: false,
            has_route_data: false,
            marker_data: [],
            marker_data_geojson: [],
            route_data: [],
            layers: props.layers,
            mapStyles : Styles,
            score_markers: true,
            show_breadcrumbs: false,
            update_layer: false
        }

        this.map = React.createRef()
        this.mapRef = React.createRef();
        
        this._onClick = this._onClick.bind(this)
        this._onHover = this._onHover.bind(this)
        this.mapLoaded = this.mapLoaded.bind(this)

        //this._getCursor = this._getCursor.bind(this)
        this.showPopup = this.showPopup.bind(this)
        this._onViewportChange = this._onViewportChange.bind(this)
    }

    // TODO: Move to componentWillUPdate
    componentWillReceiveProps(nextProps){

        const { guidesData, guideDetails, topPicks } = nextProps

        // Make it valide geoJSON
        // TODO: make valid GeoJSON in Redux?

        // TODO: Remove this is just a temporary work around to get the JSON to work with Mapbox
        let places_data = nextProps.placesData.map(place => { 
            
            delete place.properties.data_sources
            delete place.properties.hotspots_events
            
            return place
        }) 

        let places_geojson = featureCollection(places_data)
        let events_geojson = featureCollection(nextProps.eventsData)

        //console.log('Marker json: ', JSON.stringify(places_geojson))
        //let guides_geojson = featureCollection(nextProps.guideData)
        
        if (guidesData) this.handleMarkers(nextProps)
        if (topPicks) this.handleMarkers(nextProps)

        // Handle route details
        if (!isEqual(guideDetails, this.props.guideDetails)) this.handleRouteData(guideDetails.route)

        if (nextProps.detailsShown === false) this.setState({ has_route_data: false })

        // Truncate long coordinates
        places_geojson = truncate(places_geojson, { precision: 6, coordinates: 2 })
        
        this.setState({ 
            places_geojson: places_geojson,
            events_geojson: events_geojson,
            update_layer: false,
            viewport: {
                bearing: nextProps.bearing,
                latitude: nextProps.currentLocation.latitude,
                longitude: nextProps.currentLocation.longitude,
                zoom: nextProps.zoom
            }
        })

        if (nextProps.mainVibe !== this.props.mainVibe) {
            this.setState({ update_layer: true })
        }
    } 

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.mainVibe !== this.props.mainVibe) {
            // TODO: Clean up vibeset colors and renable
            //console.log('Update heatmap!!!', prevProps.mainVibe, this.props.mainVibe)            
            //this.styleHeatMap()
        }

        if (!isEqual(prevProps.allVibes, this.props.allVibes)) {

            let vibe_options = this.props.allVibes.map(function (vibe) {
                return { key: vibe, value: vibe, text: vibe }
            })

            this.setState({ vibe_options: vibe_options })
        }

    }

    componentDidMount() {
        let size = {
            height: this.map.current.offsetHeight,
            width: this.map.current.offsetWidth
        }
        
        // These both need size at the same time
        this.props.setMapSize(size)
        this.props.setMapReady(true)
        //this.handleMarkers(this.props)

    }

    mapLoaded() {
        const mapGL = this.mapRef.current.getMap()

        console.log('Map LOADED !!! ', mapGL)

        /* TODO: If the left panel is open 
        mapGL.easeTo({
            padding: {
                left: 600
            } 
        });
        */

    }

    /*
    shiftViewport() {
        const mapGL = this.mapRef.current.getMap()
        const { currentLocation, setCurrentLocation } = this.props

        let padding = -300

        let mapXY = mapGL.project([currentLocation.longitude, currentLocation.latitude])
        let new_center = mapGL.unproject([mapXY.x + padding, mapXY.y])
        console.log('Map Get center point: ', mapXY, new_center)

        setCurrentLocation({ latitude: new_center.lat, longitude: new_center.lng })

    }
    */

    styleHeatMap() {
        // TODO: only do this if the main vibe changes?         
        let heatmap = helpers
            .getHeatmap(null, this.props.mainVibe)

        // Style the legend
        heatmap.map((rgb, i) => {
            let css_var = '--heatmap_' + (i + 1)
            document.documentElement.style.setProperty(css_var, rgb)
        })

        let mapStyles = this.state.mapStyles

        mapStyles.places_heatmap['heatmap-color'] = [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0.0, 'rgba(0, 0, 0, 0.2)',
            0.1, heatmap[0],
            0.2, heatmap[1],
            0.3, heatmap[2],
            0.8, heatmap[3],
            0.9, heatmap[4],
            1.1, heatmap[5]
        ]

        this.setState({ mapStyles : mapStyles })
    }

    _onViewportChange = viewport => {

        //const mapGL = this.mapRef.current.getMap()

        // Keep Redux in sync with current map
        const { bounds, currentLocation } = this.props
        console.log('Map updated: ', bounds)

        // TODO: how to transtlate greater of viewport width or height to search radius
        this.props.setViewport(viewport)
        this.setState({ viewport })   

        // Calculate distance: If the user pans by more than 2 kilometers, update the map
        let new_location = point([viewport.longitude, viewport.latitude])
        let original_location = point([this.props.currentLocation.longitude, this.props.currentLocation.latitude])
        let distance_changed = distance(original_location, new_location)

        //  Should location be updated in Redux? 
        let setLocation = false

        // TODO: Need to throttle and take the last, most recent value
        if (viewport.longitude != 0 && viewport.latitude != 0 && distance_changed > 0.25) setLocation = true

        if (viewport.bearing !== this.props.bearing) this.props.setBearing(viewport.bearing)
    
        if (viewport.zoom > 2 && viewport.zoom !== this.props.zoom) {
            setLocation = true
            this.props.setZoom(viewport.zoom)
        }

        // Update Location in one
        if (setLocation) {
            const location = { latitude: viewport.latitude, longitude: viewport.longitude, distance: distance_changed }
            
            // TODO: This is causing the location to be set to zero!!!
            this.props.setCurrentLocation(location)
        }
    }   
    
    // Set details when marker or icon is clicked
    _onClick = (event, feature) => {
        console.log("Clicked this: ", event.lngLat, feature)
        let id = null
        let place_type = null

        // Handle one or more features
        if (feature && feature.id) {
            id = feature.id
            place_type = feature.properties.place_type
        } else if (event.features.length > 0 && event.features[0].hasOwnProperty('properties') && event.features[0].properties.id) {
            id = event.features[0].properties.id 
            place_type = event.features[0].properties.place_type
        }
        
        if (id !== null) {
            this.props.setDetailsId(id)
            this.props.setDetailsType(place_type)
            // TODO: there's probably a smart way to do this with browser history
            this.setState({ prev_zoom : this.props.zoom })
            this.props.setDetailsShown(true)
            this.props.setZoom(this.props.zoom + 2)
        }
    }

    // Show tooltips on hover.
    _onHover = event => {
        const feature = event.features && event.features[0];

        // There a layer & feature
        if (feature && event.features.length > 0) {
            let first_feature = event.features[0]            
            if (first_feature.properties.name && (first_feature.layer.id === "top_picks" || first_feature.layer.id === "places_markers" || first_feature.layer.id === "events")) {
                
                this.showPopup(first_feature.properties.name, event.lngLat[1], event.lngLat[0])
            }
            
        } else { 
            this.setState({ popupInfo: null })
        }
    }

    handleMarkers(props) {

        const { detailsShown, placeType, guidesData, guideDetails, guideMarkers, topPicks } = props
        let { has_marker_data, marker_data, marker_data_geojson, score_markers } = this.state

        if (placeType === 'places' || placeType === 'events') {
            marker_data = topPicks
            marker_data_geojson = featureCollection(marker_data)
        } 
        if (placeType === 'guides') {
            marker_data = guidesData
            score_markers = false

            //guideDetails.route = { "type": "Feature", "properties": { "distance": 39433.076 }, "geometry": { "type": "LineString", "coordinates": [[-122.41301, 37.765377], [-122.413132, 37.765369], [-122.413101, 37.765076], [-122.413605, 37.763824], [-122.415169, 37.763699], [-122.415123, 37.763264], [-122.415169, 37.763699], [-122.421738, 37.763306], [-122.421707, 37.762928], [-122.421211, 37.762955], [-122.421707, 37.762928], [-122.421577, 37.7617], [-122.41938, 37.761841], [-122.418671, 37.754387], [-122.41938, 37.761841], [-122.413986, 37.762165], [-122.413101, 37.765076], [-122.413185, 37.765999], [-122.412811, 37.766758], [-122.41256, 37.766788], [-122.412613, 37.767597], [-122.411781, 37.768715], [-122.410828, 37.76902], [-122.410873, 37.769333], [-122.404449, 37.76976], [-122.404068, 37.770008], [-122.404045, 37.770035], [-122.403915, 37.770081], [-122.40168, 37.771832], [-122.401512, 37.771824], [-122.397247, 37.775211], [-122.395401, 37.776615], [-122.394951, 37.776878], [-122.394333, 37.776394], [-122.391998, 37.778225], [-122.390518, 37.777138], [-122.387604, 37.778286], [-122.387535, 37.778183], [-122.387047, 37.778191], [-122.385635, 37.777733], [-122.374046, 37.778023], [-122.368317, 37.780373], [-122.364838, 37.78265], [-122.354187, 37.795113], [-122.346306, 37.799332], [-122.341743, 37.800514], [-122.337524, 37.800179], [-122.305725, 37.792282], [-122.295769, 37.792213], [-122.294495, 37.791122], [-122.293839, 37.792198], [-122.28019, 37.79451], [-122.280136, 37.794491], [-122.279739, 37.79512], [-122.278793, 37.794743], [-122.276924, 37.794548], [-122.275215, 37.793877], [-122.274918, 37.794342], [-122.274437, 37.794155], [-122.274368, 37.794258], [-122.268883, 37.792171], [-122.26841, 37.792034], [-122.262154, 37.790703], [-122.252197, 37.788403], [-122.252441, 37.787865], [-122.253761, 37.787861], [-122.253845, 37.788036], [-122.252884, 37.788376], [-122.252792, 37.788567], [-122.253159, 37.788662], [-122.265854, 37.791405], [-122.268265, 37.792034], [-122.274368, 37.794258], [-122.274437, 37.794155], [-122.274918, 37.794342], [-122.275215, 37.793877], [-122.276924, 37.794548], [-122.278793, 37.794743], [-122.279739, 37.79512], [-122.280136, 37.794491], [-122.28019, 37.79451], [-122.293839, 37.792198], [-122.294495, 37.791122], [-122.295769, 37.792213], [-122.305725, 37.792282], [-122.337524, 37.800179], [-122.341743, 37.800514], [-122.346306, 37.799332], [-122.354187, 37.795113], [-122.364838, 37.78265], [-122.368317, 37.780373], [-122.374046, 37.778023], [-122.385635, 37.777733], [-122.387047, 37.778191], [-122.387535, 37.778183], [-122.387604, 37.778286], [-122.390518, 37.777138], [-122.391998, 37.778225], [-122.394333, 37.776394], [-122.394951, 37.776878], [-122.39727, 37.775227], [-122.401535, 37.771847], [-122.401596, 37.7719], [-122.403687, 37.770214], [-122.403915, 37.770081], [-122.404068, 37.770008], [-122.406723, 37.769306], [-122.410873, 37.769333], [-122.410828, 37.76902], [-122.411781, 37.768715], [-122.412613, 37.767597], [-122.41256, 37.766788], [-122.412811, 37.766758], [-122.413185, 37.765999], [-122.413101, 37.765076], [-122.413986, 37.762165], [-122.415016, 37.762108], [-122.414101, 37.752506], [-122.414803, 37.752464]] } }

            if (detailsShown && guideDetails.route !== null && guideMarkers.length > 0) {
                //route_data = guideDetails.route
                marker_data = guideMarkers
                marker_data_geojson = featureCollection(marker_data)            
            }
        }

        has_marker_data = marker_data.length > 0

        this.setState({
            marker_data: marker_data,
            marker_data_geojson: marker_data_geojson,
            score_markers: score_markers,
            has_marker_data: has_marker_data
        })
    }

    handleRouteData(route_data) {

        let has_route_data = false
        if (route_data !== undefined) has_route_data = true
        
        if (has_route_data) {
            this.setState({ route_data: route_data, has_route_data: true })

            let bounds = bbox(route_data);
            // This zooms in too much: mapGL.fitBounds(bounds);

            let center = center(route_data)

            this.props.setCurrentLocation({ latitude: center.geometry.coordinates[1], longitude: center.geometry.coordinates[0] })
            this.props.setZoom(14)
            //mapGL.flyTo({ center: center.geometry.coordinates });
        } 
    }

    showPopup(name, latitude, longitude) {
        this.setState({
            popupInfo: {
                name: name,
                latitude: latitude,
                longitude: longitude
            }
        })
    }    

    render() {

        const { currentLocation, densityBonus, guideDetails, layers, mapboxToken, isMobile, searchTerm } = this.props
        const { has_marker_data, has_route_data, marker_data, marker_data_geojson, route_data, score_markers } = this.state
        
        let has_places_data = this.props.placesData.length > 0
        let has_events_data = this.props.eventsData.length > 0

        const mapController = new CustomMapController()
        const mapStyles = this.state.mapStyles

        let heat_map_filter = [this.props.activity]
        if (this.props.activity === 'all' || this.props.activity === '') {
            heat_map_filter = ["food", "shopping", "outdoors"]
        }

        if (densityBonus) {
            /* TODO: Better scalling for low and high densities */
            // Take the mean of density bonus and the default intensity
            let intensity = this.props.densityBonus
            mapStyles.places_heatmap['heatmap-intensity'] = intensity
        }

        // Marker are better controled with a layout style
        try {
            mapStyles.marker_layout.visibility = layers.places_markers ? "visible" : "none"            
        } catch (error) {
            console.log(error, layers)
        }
                
        let heat_map_visibility = this.props.layers.heatmap ? 'visible' : 'none'

        let mapHeight = '100%', mapWidth = '100%'

        if (isMobile) mapHeight = '100vh'

        return (
            <Fragment>
                <div className = 'map_container' ref={this.map}>
                              
                    {isMobile === false && <Fragment>
                        {/* Floating legend */}
                        <ZoomLegend zoom={this.props.zoom} />
                        <LayersFilter />
                    </Fragment> 
                    }
                    <div className={'map_search'} style={{ position: 'absolute', zIndex: '10', padding: '1em', width: '100%'}}>
                        {isMobile &&
                            <Link to='/search/' style={{ display: 'block'}}>
                                <Search
                                    fluid 
                                    placeholder="What's your vibe?"
                                    style={{ width: '90%' }} value={searchTerm}/>
                            </Link>
                        }
                        <AllVibes vibes={this.props.allVibes} />
                    </div>

                    {/* TODO: Move to it's own class <Map> */}
                    <ReactMapGL
                        {...this.state.viewport}
                        controller={mapController}
                        ref={this.mapRef}
                        height={mapHeight}
                        width={mapWidth}
                        transition={{ "duration": 300, "delay": 0 }}                        
                        mapboxApiAccessToken={mapboxToken}
                        mapStyle={Constants.MAPBOX_STYLE}                    
                        onClick={this._onClick}
                        onLoad={this.mapLoaded}
                        //getCursor={this._getCursor}
                        onHover={this._onHover}                        
                        onViewportChange={this._onViewportChange}
                    >
                    
                        {isMobile === false &&
                            <NavigationControl
                                style={mapStyles.navigateStyle}
                                showZoom={true}
                                showCompass={true}
                            />
                        }

                        <GeolocateControl
                            style={mapStyles.geolocateStyle}
                            positionOptions={{ enableHighAccuracy: true }}
                            trackUserLocation={true}
                        />

                        <ScaleControl maxWidth={200} unit='imperial' />                        
                        
                        {has_marker_data &&
                            <Fragment>
                                <Source
                                    id='top_picks'
                                    type="geojson"
                                    data={marker_data_geojson}
                                    cluster={false}>

                                    <Layer
                                        id="photo_markers"
                                        type="symbol"
                                        layout={mapStyles.top_pick_layout}
                                        paint={mapStyles.top_pick_paint}
                                    />
                                    
                                </Source>
                                {/* TODO: this state should be synced with the top_picks react state */}
                                {this.props.layers.photo_markers &&
                                    <Markers
                                        data={marker_data}
                                        vibes={this.props.vibes}
                                        zoom={this.props.zoom}
                                        onClick={this._onClick}
                                        score_markers={score_markers}
                                        showPopup={this.showPopup} />
                                }
                            </Fragment>
                        }

                        {has_route_data &&
                            <Fragment>
                                <Source
                                    id='route'
                                    type="geojson"
                                    data={route_data}>
                                
                                    <Layer
                                        id="walking_route"
                                        type="line"
                                        layout={mapStyles.route_layout}
                                        paint={mapStyles.route_paint}
                                    />
                                </Source>

                            </Fragment>
                        }

                        {/* this.props.layers.neighborhoods === true &&
                            // mapbox://stevepepple.ck896dj6863jf2rpm6ioemfpm-5fmfa
                            <Fragment>                            

                            <VectorTile
                                id='neighborhoods_all'
                                type='symbol'
                                source='tile_layer'
                                source-layer='places'
                                tiles={"https://a.tiles.mapbox.com/v4/stevepepple.ck896dj6863jf2rpm6ioemfpm-5fmfa/{z}/{x}/{y}.mvt?access_token=" + Constants.MAPBOX_TOKEN}                                
                                layout={mapStyles.neighborhood_layout}
                                paint={mapStyles.neighborhood_paint}
                                visibility='visible'
                            />
                            </Fragment>                          
                        */}
                        
                        {this.props.detailsShown && this.props.placeType !== 'guides' && this.props.currentItem.location !== null &&
                            /* Current place marker */
                            <Marker
                                longitude={this.props.currentItem.location.longitude}
                                latitude={this.props.currentItem.location.latitude}
                                offsetTop={-2}
                                offsetLeft={-2}>   
                                <Selected size={helpers.scaleSelectedMarker(this.props.zoom)} />
                            </Marker>
                        }
                        
                        {has_places_data &&
                            <Source
                                id='places_source'
                                type="geojson"
                                data={this.state.places_geojson}
                                cluster={false}>

                                <Layer
                                    id='places_markers'
                                    key='places_markers'
                                    //beforeId='photo_markers'
                                    type='symbol'
                                    layout={mapStyles.marker_layout}
                                    paint={mapStyles.marker_paint} />

                                {/* 
                                <Layer
                                    id='places_circle'
                                    type='circle'
                                    //beforeId='places_markers'
                                    paint={mapStyles.places_circle}
                                    isLayerChecked={true} />
                                */}

                            </Source>
                        }                    

                        {this.props.layers.clusters && 
                            <Source
                                type="geojson"
                                data={this.state.places_geojson}
                                cluster={true}
                                clusterMaxZoom={14}
                                clusterRadius={60}
                                ref={this._sourceRef}>
                                <Layer {...clusterLayer} />
                                <Layer {...clusterCountLayer} />
                                <Layer {...unclusteredPointLayer} />
                            </Source>
                        }

                        {has_events_data && 
                            <Source
                                id='events'
                                type="geojson"
                                data={this.state.events_geojson}
                                cluster={false}>

                                <Layer
                                    id="events"
                                    type="symbol"
                                    layout={mapStyles.marker_layout}
                                    paint={mapStyles.marker_paint}/>
                                                                                            
                            </Source>
                        }

                        {/* Only render popup if it's not null */}
                        {this.state.popupInfo &&
                            <Popup
                                tipSize={2}
                                className={'marker-popup'}
                                offsetTop={-10}
                                longitude={this.state.popupInfo.longitude}
                                latitude={this.state.popupInfo.latitude}                                
                                closeOnClick={true}
                                onClose={() => this.setState({ popupInfo: null })}
                            >
                                {this.state.popupInfo.name}
                            </Popup>
                        }
                        
                        
                        <VectorTile
                            id='heat_layer'
                            type='heatmap'
                            source='tile_layer'
                            source_layer='places'
                            tiles='https://tiles.vibemap.com/maps/places/{z}/{x}/{y}.mvt'
                            filter={[
                                "all",
                                [
                                    "match",
                                    ["get", "primary_category"],
                                    heat_map_filter,
                                    true,
                                    false
                                ]
                            ]}
                            paint={mapStyles.places_heatmap}
                            visibility={heat_map_visibility}
                            update_layer={this.state.update_layer}
                        />

                    </ReactMapGL>

                </div>
            </Fragment>   
        )
    }
}

const mapStateToProps = state => ({
    // General
    windowSize: state.windowSize,
    mapboxToken: state.mapboxToken,

    // Navigation
    currentLocation: state.nav.currentLocation,
    activity: state.nav.activity,
    allVibes: state.nav.allVibes,
    searchTerm: state.nav.searchTerm,
    vibes: state.nav.vibes,

    // Map
    bearing: state.map.bearing,
    bounds: state.map.bounds,
    densityBonus: state.map.densityBonus,
    layersChanged: state.map.layersChanged,
    mapReady: state.map.mapReady,
    mapSize: state.map.mapSize,
    mainVibe: state.nav.mainVibe,
    placeType: state.nav.placeType,
    zoom: state.map.zoom,
    viewport: state.map.viewport,

    // Places
    currentItem: state.places.currentItem,
    nearby_places: state.nearby_places,
    eventsData: state.eventsData,
    guidesData: state.guidesData,
    guideDetails: state.guideDetails,
    guideMarkers: state.guideMarkers,
    layers: state.map.layers,
    currentDistance: state.currentDistance,
    detailsId: state.places.detailsId,
    detailsType: state.detailsType,
    detailsShown: state.detailsShown,

    placesData: state.placesData,
    params: state.params,
    topPicks: state.topPicks,
    
})

const MapWithRouter = withRouter(EventsMap)

export default connect(mapStateToProps, actions)(MapWithRouter)