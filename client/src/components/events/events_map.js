import React, { Component } from 'react'
//import Geocoder from "@mapbox/react-geocoder"
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import * as turf from '@turf/turf'
import { Global } from '@emotion/core'
import ReactMapGL, { Source, Layer, NavigationControl, GeolocateControl, Marker, Popup } from 'react-map-gl'

// TODO: Remove these other map sources
import Styles from '../../styles/map_styles.js'
import Markers from '../map/markers'
import PhotoMarker from '../map/photo_marker.js'
import YouAreHere from '../map/you_are_here.js'
import ZoomLegend from '../map/ZoomLegend'

// TODO: load from common .env
import * as Constants from '../../constants.js'
import helpers from '../../helpers.js'

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

        this.setState({ 
            viewport: {
                latitude: nextProps.currentLocation.latitude,
                longitude: nextProps.currentLocation.longitude,
                zoom: this.props.currentZoom
            }
        })

        let has_data = this.props.events_data.length > 0

        // TODO: @cory Hack to group event and places heatmap, until the venues database is updated.
        let combined_places = nextProps.places_data.concat(nextProps.events_data)
        // Make it valide geoJSON
        // TODO: make valid GeoJSON in Redux?
        let places_geojson = turf.featureCollection(combined_places)
        let events_geojson = turf.featureCollection(nextProps.events_data)

        this.showLens([nextProps.currentLocation.latitude, nextProps.currentLocation.latitude])
    
        this.setState({ 
            places_geojson: places_geojson,
            events_geojson: events_geojson,
            has_data: has_data
        })
    }

    _onViewportChange = viewport => {
        
        // Keep Redux in sync with current map
        console.log("Zoom changed? ", viewport.zoom !== this.props.currentZoom)
        if (viewport.zoom > 2 && viewport.zoom !== this.props.currentZoom) {
            
            this.props.setZoom(viewport.zoom)
            this.props.setDistance(helpers.zoomToRadius(viewport.zoom))
        }

        // If the user pans by more than 2 kilometers, update the map
        let new_location = turf.point([viewport.longitude, viewport.latitude])
        let original_location = turf.point([this.props.currentLocation.longitude, this.props.currentLocation.latitude])
        let distance = turf.distance(original_location, new_location)


        // TODO: there's still a problem in how the new and old values sync...
        // Need to throttle and take the last, most recent value
        this.props.setCurrentLocation({ latitude: viewport.latitude, longitude: viewport.longitude })
        this.props.setDistance(helpers.zoomToRadius(viewport.zoom))

        if (distance > 2) {
            console.log("New location: ", viewport.latitude)
            this.props.setCurrentLocation({ latitude: viewport.latitude, longitude: viewport.longitude })
            // TODO: What the write way to trigger chaged map and data from Redux.
            //this.props.setPosition(viewport.latitude, viewport.longitude)
        }

        this.setState({ viewport })
        
    }

    _onClick = (event, feature) => {
        
        console.log("Clicked this: ", event, feature)
        //this.props.setDetailsId(feature.id)
        //this.props.setDetailsShown(true)

    }

    _onHover = event => {
        const feature = event.features && event.features[0];

        // There a layer & feature
        if (feature && event.features.length > 0) {
            let first_feature = event.features[0]
            if (first_feature.properties.name && first_feature.properties.name.length > 0) {
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
        let radius = helpers.zoomToRadius(this.props.currentZoom)
        let radius_in_kilometers = radius * Constants.METERS_PER_MILE / 1000;

        // Add circular lens to the map
        let circle = turf.circle(center, radius_in_kilometers, circle_options)
        lens.features[0] = circle
        this.setState({ lens, radius })
    }

    // Iterate through all place categories and create css icons
    // TODO: this can be done in Mapbox studio once as vectors.
    createIconStyles = () => {

        let classes = {}

        // TODO: this goes away or should at the least be a helper function
        Constants.all_categories.map(function (category) {

            if (category.key) {
                let image = category.icon.prefix + '64' + category.icon.suffix
                let class_name = '.' + category.key
                classes[class_name] = { backgroundImage: 'url(' + image + ')'}

                if(category.categories) {
                    
                    category.categories.map(function(sub_category){
                        image = sub_category.icon.prefix + '32' + sub_category.icon.suffix
                        let sub_class_name = '.' + sub_category.key;
                        classes[sub_class_name] = { backgroundImage: 'url(' + image + ')'}

                    })
                }
            }
        })

        return classes;
    }

    mapRef = React.createRef();

    render() {

        let has_places_data = this.props.places_data.length > 0
        let has_events_data = this.props.events_data.length > 0

        return (

            <div>
                <Global
                    styles={this.createIconStyles()}
                />

                <div className = 'map_container'>
                    {/* Floating legend */}

                    <ZoomLegend zoom={this.props.currentZoom} />

                    {/* TODO: Move to it's own class <Map> */}
                    <ReactMapGL
                        {...this.state.viewport}
                        width={'100%'}
                        height={'100%'}
                        mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
                        mapStyle={'mapbox://styles/stevepepple/cjpk3ts1c0skb2rs52w658p07/draft'}
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

                        <Source
                            id='lens'
                            type='geojson'
                            data={this.state.lens}>
                            
                            <Layer
                                id='lens_circle'
                                type='fill'
                                paint={Styles.lens}
                                isLayerChecked={true}
                            />
                        </Source>

                        <Source
                            id='places'
                            type="geojson"
                            data={this.state.places_geojson}
                            cluster={false}>

                            <Layer
                                id='heat'
                                type='heatmap'
                                paint={Styles.places_heatmap}
                                isLayerChecked={true}
                            />

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
                            data={this.props.events_data} 
                            currentVibes={this.props.currentVibes} 
                            zoom={this.props.currentZoom}
                            onClick={this._onClick}
                            showPopup={this.showPopup} />
                        
                        <Source
                            id='events'
                            type="geojson"
                            data={this.state.events_geojson}
                            cluster={false}>
                        </Source>

                    </ReactMapGL>

                </div>
            </div>   
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setZoom: zoom => dispatch(actions.setZoom(zoom)),
    setCurrentLocation: location => dispatch(actions.setCurrentLocation(location)),
    setDetailsId: id => dispatch(actions.setDetailsId(id)),
    setDetailsShown: show => dispatch(actions.setDetailsShown(show)),
    setDistance: distance => dispatch(actions.setDistance(distance))
})

const mapStateToProps = state => {
    //console.log('State in events map:', state)
    return {
        nearby_places: state.nearby_places,
        currentVibes: state.currentVibes,
        currentLocation: state.currentLocation,
        currentZoom: state.currentZoom,
        currentDistance: state.currentDistance,
        detailsId: state.detailsId,
        detailsShown: state.detailsShown
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsMap);