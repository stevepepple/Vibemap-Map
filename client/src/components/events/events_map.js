import React, { Component, Fragment } from 'react'
//import Geocoder from "@mapbox/react-geocoder"
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'


import * as turf from '@turf/turf'
import { Global } from '@emotion/core'
import queryString from 'query-string'

import ReactMapGL, { Source, Layer, NavigationControl, GeolocateControl, Marker, Popup } from 'react-map-gl'
import CustomMapController from '../map/map-conroller'

// TODO: Remove these other map sources
import Styles from '../../styles/map_styles.js'
import Markers from '../map/markers'
import Selected from '../map/selected'
import VectorTile from '../map/VectorTile'
//import YouAreHere from '../map/you_are_here.js'
import ZoomLegend from '../map/ZoomLegend'

// TODO: load from common .env
import * as Constants from '../../constants.js'
import helpers from '../../helpers.js'

import '../../styles/map.scss'

class EventsMap extends React.PureComponent {

    constructor(props) {
        super(props)

        // TODO: Move to database or it's own repository
        this.state = {
            lens : {"type": "FeatureCollection", "features": []},
            popupInfo: null,
            has_data: false,
            photos_geojson : {"type": "FeatureCollection", "features": [
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.428030, 37.758175] }, "properties": { "id": 2, "name": "Mission Dolores", "description": "#dolorespark", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/c07cbc0614f1f96f9ff1e8336b661c4c/5DA48BC6/t51.2885-15/e35/c0.163.1440.1440a/s320x320/61546227_157370168642961_5480952316658836778_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com"}},
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.420595, 37.762995] }, "properties": { "id": 3, "name": "Clarion Alley Street", "description": "#clarionalley", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/859604c1d74a65a490d2a18c537ff093/5DAC007C/t51.2885-15/sh0.08/e35/p640x640/58741888_168172800851438_5323061855820526706_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com"}},
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.424405, 37.776087] }, "properties": { "id": 3, "name": "Patricia's Green", "description": "#summersolstice", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/f3682b9240aea200e6f0733401668eec/5DA67F9C/t51.2885-15/sh0.08/e35/p640x640/62166794_224789425148114_2956678409677793196_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" }},
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.419262, 37.801776] }, "properties": { "id": 3, "name": "Lombard Street", "description": "#lombardstreet", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/f208fdf53ecb333fa61195ced677477f/5DA4AE9B/t51.2885-15/e35/c0.135.1080.1080a/s480x480/59723367_434290323800690_787244442866851805_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.4948301,37.786700] }, "properties": { "id": 3, "name": "Eagle Point", "description": "#landsend", "link": "https://www.instagram.com/p/BwIEEFwFfOw/?utm_source=ig_embed&amp;utm_medium=loading"}},
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.16, 37.48] },         "properties": { "id": 3, "name": "Latham Square", "description": "#lathamsquare", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/957dcf72c75a9f46f2d1e5b4c293e9ca/5D389323/t51.2885-15/e35/13743149_538243736374429_1777974829_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.270276, 37.806056] }, "properties": { "id": 3, "name": "Old Oakland", "description": "#oldoakland", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/386d0a73eed11b147ee421661be863ce/5D43EFAF/t51.2885-15/sh0.08/e35/p640x640/57156404_2867198356624462_4903447287018024385_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.262863, 37.798538] }, "properties": { "id": 3, "name": "Oakland Museum", "description": "#oaklandmuseum", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/386d0a73eed11b147ee421661be863ce/5D43EFAF/t51.2885-15/sh0.08/e35/p640x640/57156404_2867198356624462_4903447287018024385_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.278357, 37.794801] }, "properties": { "id": 3, "name": "Jack London Square", "description": "#jacklondon", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/386d0a73eed11b147ee421661be863ce/5D43EFAF/t51.2885-15/sh0.08/e35/p640x640/57156404_2867198356624462_4903447287018024385_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.260411, 37.808357] }, "properties": { "id": 3, "name": "Children's Fairyland", "description": "#grandlake", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/a8a144e410bf662d6727a8792147e453/5DE14E60/t51.2885-15/e35/s1080x1080/66769440_1171801839684544_759436189221567567_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.324526, 37.805267] }, "properties": { "id": 3, "name": "Middle Harbor Shoreline Park", "description": "#shorline", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/0a29c867dc9ea7075d6fa658f74d2ff6/5D34ADF3/t51.2885-15/sh0.08/e35/s640x640/46202609_2015403528514585_3719740415001179715_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com 640w,https://scontent-sjc3-1.cdninstagram.com/vp/8d8dbda1e5d7dc14c708ff243e54a04d/5D6ED737/t51.2885-15/sh0.08/e35/s750x750/46202609_2015403528514585_3719740415001179715_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com 750w,https://scontent-sjc3-1.cdninstagram.com/vp/509ffe7aa9e1bc9de717d3950a429fda/5D5A4A49/t51.2885-15/e35/46202609_2015403528514585_3719740415001179715_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } }
                
            ]}
        }
        
        this._onClick = this._onClick.bind(this)
        this._onHover = this._onHover.bind(this)
        //this._getCursor = this._getCursor.bind(this)
        this.showPopup = this.showPopup.bind(this)
        this._onViewportChange = this._onViewportChange.bind(this)
    }

    // TODO: Move to componentWillUPdate
    componentWillReceiveProps(nextProps){

        // TODO: @cory Hack to group event and places heatmap, until the venues database is updated.
        let combined_places = nextProps.places_data.concat(nextProps.events_data)
        // Make it valide geoJSON
        // TODO: make valid GeoJSON in Redux?
        let places_geojson = turf.featureCollection(nextProps.places_data)
        let events_geojson = turf.featureCollection(nextProps.events_data)
        let top_picks_geojson = turf.featureCollection(nextProps.topPicks)

        //this.showLens([nextProps.currentLocation.latitude, nextProps.currentLocation.latitude])
        let has_data = this.props.events_data.length > 0

        let zoom = nextProps.zoom

        this.setState({ 
            places_geojson: places_geojson,
            events_geojson: events_geojson,
            top_picks_geojson: top_picks_geojson,
            has_data: has_data,
            viewport: {
                bearing: nextProps.bearing,
                latitude: nextProps.currentLocation.latitude,
                longitude: nextProps.currentLocation.longitude,
                zoom: zoom
            }
        })
    }

    _onViewportChange = viewport => {

        console.log('Viewport: ', viewport)
        
        // Keep Redux in sync with current map
        // TODO: how to transtlate greater of viewport width or height to search radius

        // If the user pans by more than 2 kilometers, update the map
        let new_location = turf.point([viewport.longitude, viewport.latitude])
        let original_location = turf.point([this.props.currentLocation.longitude, this.props.currentLocation.latitude])
        let distance = turf.distance(original_location, new_location)

        // TODO: there's still a problem in how the new and old values sync...
        // Need to throttle and take the last, most recent value
        if (viewport.longitude > 0) {
            this.props.setCurrentLocation({ latitude: viewport.latitude, longitude: viewport.longitude })
            this.props.setLocationParams(this.props.currentLocation)
        }

        if (distance > 0.05) {
            this.props.setCurrentLocation({ latitude: viewport.latitude, longitude: viewport.longitude })
            this.props.setLocationParams(this.props.currentLocation)
        }

        if (viewport.zoom > 2 && viewport.zoom !== this.props.zoom) {
            this.props.setZoom(viewport.zoom)
            this.props.setDistance(helpers.zoomToRadius(viewport.zoom))
        }

        if (viewport.bearing !== this.props.bearing) {
            this.props.setBearing(viewport.bearing)
        }

        this.setState({ viewport })   
    }

    _onClick = (event, feature) => {
        
        console.log("Clicked this: ", event, feature)
        //this.props.setDetailsId(feature.id)
        //this.props.setDetailsShown(true)
        let id = null
        if (feature && feature.id) {
            id = feature.id
        } else if (event.features.length > 0 && event.features[0].hasOwnProperty('properties') && event.features[0].properties.id) {
            id = event.features[0].properties.id 
        }
        
        if (id !== null) {
            this.props.setDetailsId(id)
            // TODO: there's probably a smart way to do this with browser history
            this.setState({ prev_zoom : this.props.zoom })
            this.props.setDetailsShown(true)
            this.props.setZoom(this.props.zoom + 2)
        }
    }

    _onHover = event => {
        const feature = event.features && event.features[0];

        // There a layer & feature
        if (feature && event.features.length > 0) {
            let first_feature = event.features[0]            
            if (first_feature.properties.name && (first_feature.layer.id === "top_picks" || first_feature.layer.id === "places")) {
                
                this.showPopup(first_feature.properties.name, event.lngLat[1], event.lngLat[0])
            }
            
        } else { 
            this.setState({ popupInfo: null })
        }
    }

    showPopup(name, latitude, longitude){
        this.setState({
            popupInfo: {
                name: name,
                latitude: latitude,
                longitude: longitude
            }
        })
    }

    // TODO: Move to it's own component
    showLens = (center) => {
        let lens = this.state.lens
        let circle_options = { units: 'kilometers' }
        // TODO: consolidate with helpers? 
        // TODO: and update value from React
        // Zoom 13 = 1, Zoom 12=5, Zoom 11=10, Zoom 10=20
        let radius = helpers.zoomToRadius(this.props.zoom)
        let radius_in_kilometers = radius * Constants.METERS_PER_MILE / 1000;

        // Add circular lens to the map
        let circle = turf.circle(center, radius_in_kilometers, circle_options)
        lens.features[0] = circle
        this.setState({ lens, radius })
    }

    mapRef = React.createRef();

    render() {

        let has_places_data = this.props.places_data.length > 0
        let has_events_data = this.props.events_data.length > 0


        const mapController = new CustomMapController()

        return (

            <Fragment>

                <div className = 'map_container'>
                    {/* Floating legend */}

                    <ZoomLegend zoom={this.props.zoom} />

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
                            style={Styles.geolocateStyle}
                            positionOptions={{ enableHighAccuracy: true }}
                            trackUserLocation={true}
                        />           

                        {this.props.detailsShown && this.props.currentPlace.location !== null &&
                            <Marker
                                longitude={this.props.currentPlace.location.longitude}
                                latitude={this.props.currentPlace.location.latitude}
                                offsetTop={-2}
                                offsetLeft={-2}
                            >   
                                <Selected size={60} />
                            </Marker>
                        }
     
                        
                        <Source
                            id='places_2'
                            type="geojson"
                            data={this.state.places_geojson}
                            cluster={false}>

                            {/* 
                            <Layer
                                id='heat'
                                type='heatmap'
                                paint={Styles.places_heatmap}
                                isLayerChecked={true}
                            />                                                    
                            */}
                            <Layer
                                id='places_circle'
                                type='circle'
                                paint={Styles.places_circle}
                                isLayerChecked={true}
                            />
                            
                            <Layer
                                id="places"
                                type="symbol"
                                layout={Styles.marker_layout}
                                paint={Styles.marker_paint}
                            />
                            
                        </Source>

                        {/* Only render popup if it's not null */}
                        {this.state.popupInfo &&
                            <Popup
                                tipSize={4}
                                className={'marker-popup'}
                                offsetTop={-4}
                                longitude={this.state.popupInfo.longitude}
                                latitude={this.state.popupInfo.latitude}
                                closeOnClick={false}
                                onClose={() => this.setState({ popupInfo: null })}
                            >
                                {this.state.popupInfo.name}
                            </Popup>
                        }                        

                        <Markers
                            data={this.props.topPicks}
                            currentVibes={this.props.currentVibes}
                            zoom={this.props.zoom}
                            onClick={this._onClick}
                            showPopup={this.showPopup} />
                        
                        <Source
                            id='top_picks'
                            type="geojson"
                            data={this.state.top_picks_geojson}
                            cluster={false}>

                            <Layer
                                id="top_picks"
                                type="symbol"
                                layout={Styles.top_pick_layout}
                                paint={Styles.marker_paint}
                            />

                            <Layer
                                id="top_vibes"
                                type="symbol"
                                layout={Styles.top_vibe_layout}
                                paint={Styles.top_pick_paint}
                            />
                        </Source>

                        <VectorTile
                            id='heat_layer'
                            type='heatmap'                            
                            source='tile_layer'
                            source-layer='places'
                            //paint={Styles.places_heatmap}
                        />

                        {/*
                        <Source
                            id='events'
                            type="geojson"
                            data={this.state.events_geojson}
                            cluster={false}>
                        </Source>
                        */}

                    </ReactMapGL>

                </div>
            </Fragment>   
        )
    }
}

// TODO: What's the downside of simply important all actions
const mapDispatchToProps = dispatch => ({
    setBearing: bearing => dispatch(actions.setBearing(bearing)),
    setZoom: zoom => dispatch(actions.setZoom(zoom)),
    setCurrentLocation: location => dispatch(actions.setCurrentLocation(location)),
    setDetailsId: id => dispatch(actions.setDetailsId(id)),
    setDetailsShown: show => dispatch(actions.setDetailsShown(show)),
    setDistance: distance => dispatch(actions.setDistance(distance))
})

const mapStateToProps = state => {
    //console.log('State in events map:', state)
    return {
        activity: state.activity,
        baseZoom: state.baseZoom,
        bearing: state.bearing,
        nearby_places: state.nearby_places,
        currentVibes: state.currentVibes,
        currentLocation: state.currentLocation,
        currentPlace: state.currentPlace,
        zoom: state.zoom,
        currentDistance: state.currentDistance,
        detailsId: state.detailsId,
        detailsShown: state.detailsShown,
        pathname: state.router.location.pathname,
        params: state.params,
        search: state.router.location.search,
        topPicks: state.topPicks
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsMap);