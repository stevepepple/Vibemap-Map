import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import * as turf from '@turf/turf'


import ReactMapGL, { Source, Layer, NavigationControl, GeolocateControl, Marker, Popup, ScaleControl } from 'react-map-gl'
import CustomMapController from '../map/map-conroller'

// TODO: Remove these other map sources
import Styles from '../../styles/map_styles.js'
import Markers from '../map/markers'
import Selected from '../map/selected'
import VectorTile from '../map/VectorTile'
import LayersFilter from '../map/LayersFilter'
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from '../map/layers';
//import YouAreHere from '../map/you_are_here.js'
import ZoomLegend from '../map/ZoomLegend'

// TODO: load from common .env
import * as Constants from '../../constants.js'
import helpers from '../../helpers.js'

import '../../styles/map.scss'

class EventsMap extends React.Component {

    constructor(props) {
        super(props)

        // TODO: Move to database or it's own repository
        this.state = {
            lens : {"type": "FeatureCollection", "features": []},
            popupInfo: null,
            has_data: false,
            layers: props.layers,
            mapStyles : Styles
        }

        this.map = React.createRef()
        
        this._onClick = this._onClick.bind(this)
        this._onHover = this._onHover.bind(this)
        //this._getCursor = this._getCursor.bind(this)
        this.showPopup = this.showPopup.bind(this)
        this._onViewportChange = this._onViewportChange.bind(this)
    }

    // TODO: Move to componentWillUPdate
    componentWillReceiveProps(nextProps){

        
        // Make it valide geoJSON
        // TODO: make valid GeoJSON in Redux?
        let places_geojson = turf.featureCollection(nextProps.places_data)
        let events_geojson = turf.featureCollection(nextProps.events_data)
        let top_picks_geojson = turf.featureCollection(nextProps.topPicks)        

        let zoom = nextProps.zoom

        this.setState({ 
            places_geojson: places_geojson,
            events_geojson: events_geojson,
            top_picks_geojson: top_picks_geojson,
            viewport: {
                bearing: nextProps.bearing,
                latitude: nextProps.currentLocation.latitude,
                longitude: nextProps.currentLocation.longitude,
                zoom: zoom
            }
        })        
    }    

    componentDidMount() {
        let size = {
            height: this.map.current.offsetHeight,
            width: this.map.current.offsetWidth
        }

        // These both need size at the same time
        this.props.setMapSize(size)

        this.props.setMapReady(true)
    }

    _onViewportChange = viewport => {
        
        // Keep Redux in sync with current map
        // TODO: how to transtlate greater of viewport width or height to search radius
        this.props.setViewport(viewport)

        // If the user pans by more than 2 kilometers, update the map
        let new_location = turf.point([viewport.longitude, viewport.latitude])
        let original_location = turf.point([this.props.currentLocation.longitude, this.props.currentLocation.latitude])
        let distance = turf.distance(original_location, new_location)

        let setLocation = false
        let setBearing = false

        // TODO: there's still a problem in how the new and old values sync...
        // Need to throttle and take the last, most recent value
        if (viewport.longitude > 0) setLocation = true

        if (distance > 0.05) setLocation = true

        if (viewport.bearing !== this.props.bearing) this.props.setBearing(viewport.bearing)
    
        if (viewport.zoom > 2 && viewport.zoom !== this.props.zoom) {
            setBearing = true
        
            // TODO: Can distance be remove from here? 
            //this.props.setDistance(helpers.zoomToRadius(viewport.zoom))
        }

        // Update Location in one
        if (setLocation) {
            this.props.setCurrentLocation({ latitude: viewport.latitude, longitude: viewport.longitude, distance_changed: distance })
            this.props.setLocationParams(this.props.currentLocation)
        }

        // Update bearing
        if (setBearing) this.props.setZoom(viewport.zoom)

        this.setState({ viewport })   
    }    

    // Set details when marker or icon is clicked
    _onClick = (event, feature) => {
        console.log("Clicked this: ", event, feature)
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
            if (first_feature.properties.name && (first_feature.layer.id === "top_picks" || first_feature.layer.id === "places" || first_feature.layer.id === "events")) {
                
                this.showPopup(first_feature.properties.name, event.lngLat[1], event.lngLat[0])
            }
            
        } else { 
            this.setState({ popupInfo: null })
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

        let has_places_data = this.props.places_data.length > 0
        let has_events_data = this.props.events_data.length > 0
        let has_top_pick_data = this.props.topPicks.length > 0

        const mapController = new CustomMapController()
        const mapStyles = this.state.mapStyles

        // Marker are better controled with a layout style
        mapStyles.marker_layout.visibility = this.props.layers.places_markers ? "visible" : "none"
        
        //this._map.setLayoutProperty('place_markers', 'visibility', mapStyles.marker_layout.visibility);

        
        let heat_map_visibility = this.props.layers.heatmap ? 'visible' : 'none'

        return (
            <Fragment>
                <div className = 'map_container' ref={this.map}>
                    {/* Floating legend */}    
                    <ZoomLegend zoom={this.props.zoom}/>          

                    <LayersFilter/>

                    {/* TODO: Move to it's own class <Map> */}
                    <ReactMapGL
                        {...this.state.viewport}
                        controller={mapController}
                        width={'100%'}
                        height={'100%'}
                        transition={{ "duration": 300, "delay": 0 }}                        
                        mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
                        mapStyle={Constants.MAPBOX_STYLE}
                        onClick={this._onClick}
                        //getCursor={this._getCursor}
                        onHover={this._onHover}                        
                        onViewportChange={this._onViewportChange}
                    >
                    
                        <NavigationControl
                            showZoom={true}
                            showCompass={true}
                        />

                        <GeolocateControl
                            style={mapStyles.geolocateStyle}
                            positionOptions={{ enableHighAccuracy: true }}
                            trackUserLocation={true}
                        />

                        <ScaleControl maxWidth={200} unit='imperial' />

                        {has_top_pick_data &&
                            <Fragment>
                                <Source
                                    id='top_picks'
                                    type="geojson"
                                    data={this.state.top_picks_geojson}
                                    cluster={false}>

                                    <Layer
                                        id="photo_markers"
                                        type="symbol"
                                        layout={mapStyles.top_pick_layout}
                                        paint={mapStyles.top_pick_paint}
                                    />

                                    <Layer
                                        id="top_vibes"
                                        type="symbol"
                                        layout={mapStyles.top_vibe_layout}
                                        paint={mapStyles.top_pick_paint}
                                    />

                                </Source>
                                {/* TODO: this state should be synced with the top_picks react state */}
                                {this.props.layers.photo_markers &&
                                    <Markers
                                        data={this.props.topPicks}
                                        currentVibes={this.props.currentVibes}
                                        zoom={this.props.zoom}
                                        onClick={this._onClick}
                                        showPopup={this.showPopup} />
                                }
                            </Fragment>
                        }

                        {this.props.detailsShown && this.props.currentPlace.location !== null &&
                            /* Current place marker */
                            <Marker
                                longitude={this.props.currentPlace.location.longitude}
                                latitude={this.props.currentPlace.location.latitude}
                                offsetTop={-2}
                                offsetLeft={-2}
                            >   
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
                                    id='places_circle'
                                    type='circle'
                                    beforeId='places_markers'
                                    paint={mapStyles.places_circle}
                                    isLayerChecked={true} />

                                <Layer
                                    id='places_markers'
                                    key='places_markers'
                                    beforeId='photo_markers'
                                    type='symbol'
                                    layout={mapStyles.marker_layout}
                                    paint={mapStyles.marker_paint} />
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
                                tipSize={4}
                                className={'marker-popup'}
                                offsetTop={-6}
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
                            source-layer='places'
                            visibility={heat_map_visibility}
                        />

                    </ReactMapGL>

                </div>
            </Fragment>   
        )
    }
}


const mapStateToProps = state => ({
    activity: state.activity,
    baseZoom: state.baseZoom,
    bearing: state.bearing,
    bounds: state.bounds,
    nearby_places: state.nearby_places,
    currentVibes: state.currentVibes,
    currentLocation: state.currentLocation,
    currentPlace: state.currentPlace,
    layers: state.layers,
    layersChanged: state.layersChanged,
    zoom: state.zoom,
    currentDistance: state.currentDistance,
    detailsId: state.detailsId,
    detailsType: state.detailsType,
    detailsShown: state.detailsShown,
    mapReady: state.mapReady,
    mapSize: state.mapSize,
    pathname: state.router.location.pathname,
    params: state.params,
    search: state.router.location.search,
    topPicks: state.topPicks,
    windowSize: state.windowSize,
    viewport: state.viewport
})

export default connect(mapStateToProps, actions)(EventsMap)