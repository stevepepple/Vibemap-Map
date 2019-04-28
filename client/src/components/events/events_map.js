import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as turf from '@turf/turf'
import debounce from 'lodash'

import { Global, css } from '@emotion/core'

import Map from '../map.js'
import Source from '../map/source'
import Layer from '../map/layer'
import Styles from '../../styles/map_styles.js'
import Markers from '../map/markers.js';
import PhotoMarker from '../map/photo_marker.js';

//import Geocoder from "@mapbox/react-geocoder";
import { connect } from 'react-redux'

// TODO: load from common .env
import * as Constants from '../../constants.js'

class EventsMap extends Component {

    constructor(props) {
        super(props);

        this.state = {
            geojson: [],
            lens : {"type": "FeatureCollection", "features": []},
            photos_geojson : {"type": "FeatureCollection", "features": [
                {"type":"Feature","geometry":{"type":"Point","coordinates":[-122.42803,37.758175]},"properties":{"id":2,"name":"Mission Dolores","description":"#dolorespark"}},
                {"type":"Feature","geometry":{"type":"Point","coordinates":[-122.420595,37.762995]},"properties":{"id":3,"name":"Clarion Alley Street","description":"#clarionalley"}},
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.419262468736, 37.80177696725323] }, "properties": { "id": 3, "name": "Lombard Street", "description": "#lombard" } },
                {"type":"Feature","geometry":{"type":"Point","coordinates":[-122.4948301,37.78670049999999]},"properties":{"id":3,"name":"Eagle Point","description":"#landsend", "link": "https://www.instagram.com/p/BwIEEFwFfOw/?utm_source=ig_embed&amp;utm_medium=loading"}},
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.16, 37.48] }, "properties": { "id": 3, "name": "Latham Square", "description": "#lathamsquare", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/957dcf72c75a9f46f2d1e5b4c293e9ca/5D389323/t51.2885-15/e35/13743149_538243736374429_1777974829_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.270276, 37.806056] }, "properties": { "id": 3, "name": "Old Oakland", "description": "#oldoakland", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/386d0a73eed11b147ee421661be863ce/5D43EFAF/t51.2885-15/sh0.08/e35/p640x640/57156404_2867198356624462_4903447287018024385_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.262863, 37.798538] }, "properties": { "id": 3, "name": "Oakland Museum", "description": "#oaklandmuseum", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/386d0a73eed11b147ee421661be863ce/5D43EFAF/t51.2885-15/sh0.08/e35/p640x640/57156404_2867198356624462_4903447287018024385_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.278357, 37.794801] }, "properties": { "id": 3, "name": "Jack London Square", "description": "#jacklondon", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/386d0a73eed11b147ee421661be863ce/5D43EFAF/t51.2885-15/sh0.08/e35/p640x640/57156404_2867198356624462_4903447287018024385_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.260411, 37.808357] }, "properties": { "id": 3, "name": "Children's Fairyland", "description": "#jacklondon", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/386d0a73eed11b147ee421661be863ce/5D43EFAF/t51.2885-15/sh0.08/e35/p640x640/57156404_2867198356624462_4903447287018024385_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } },
                { "type": "Feature", "geometry": { "type": "Point", "coordinates": [-122.324526, 37.805267] }, "properties": { "id": 3, "name": "Middle Harbor Shoreline Park", "description": "#jacklondon", "link": "https://scontent-sjc3-1.cdninstagram.com/vp/0a29c867dc9ea7075d6fa658f74d2ff6/5D34ADF3/t51.2885-15/sh0.08/e35/s640x640/46202609_2015403528514585_3719740415001179715_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com 640w,https://scontent-sjc3-1.cdninstagram.com/vp/8d8dbda1e5d7dc14c708ff243e54a04d/5D6ED737/t51.2885-15/sh0.08/e35/s750x750/46202609_2015403528514585_3719740415001179715_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com 750w,https://scontent-sjc3-1.cdninstagram.com/vp/509ffe7aa9e1bc9de717d3950a429fda/5D5A4A49/t51.2885-15/e35/46202609_2015403528514585_3719740415001179715_n.jpg?_nc_ht=scontent-sjc3-1.cdninstagram.com" } }
                
            ]}
        }
    }

    componentDidMount(){
        let geojson = turf.featureCollection(this.props.events_data)
        this.setState({ geojson: geojson })

        let places_geojson = turf.featureCollection(this.props.places_data);

        this.setState({ places_geojson: places_geojson })
    }

    componentWillReceiveProps(nextProps){
        let geojson = turf.featureCollection(nextProps.events_data);

        this.setState({ geojson: geojson, zoom : nextProps.zoom })

        this.showLens([nextProps.lng, nextProps.lat])
        // TODO: Hack to group event and places heatmap, until the venues database is updated.
        let combined_places = nextProps.places_data.concat(nextProps.events_data)
        let places_geojson = turf.featureCollection(combined_places);

        this.setState({ places_geojson: places_geojson })
    }

    onSelect = function() {
        console.log('Geocoding result: ')
    }

    onMapChange = (position, zoom, props) => {
        this.props.setPosition(position.lat, position.lng)
        this.showLens([position.lng, position.lat])
        this.props.setZoom(zoom)
        this.setState({ zoom })
    }

    showLens = (center) => {
        let lens = this.state.lens
        let circle_options = { units: 'kilometers'}
        // TODO: consolidate with helpers? 
        let radius_in_kilometers = this.props.distance * Constants.METERS_PER_MILE / 1000;

        // Add circular lens to the map
        let circle = turf.circle(center, radius_in_kilometers, circle_options)
        lens.features[0] = circle;
        this.setState({ lens })

    }

    // Iterate through all place categories and create css icons
    createIconStyles = () => {

        let classes = {}

        Constants.all_categories.map(function (category) {

            if (category.key) {
                let image = category.icon.prefix + '32' + category.icon.suffix;
                let class_name = '.' + category.key;
                classes[class_name] = { backgroundImage: 'url(' + image + ')'}

                if(category.categories) {
                    
                    category.categories.map(function(sub_category){
                        image = sub_category.icon.prefix + '32' + sub_category.icon.suffix;
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

        let has_places_data = this.props.events_data.length > 0;
        let has_events_data = this.props.events_data.length > 0;

        // Give a sense of scale to each zoom level; rounded to whole integer
        let zoom_level = Constants.zoom_levels[Math.round(this.state.zoom)]
        
        return (
            <div>
                <Global
                    styles={this.createIconStyles()}
                />

                <div className = 'map_container'>
                    {/* Floating legend */}
                    <div id='scale'>{this.state.zoom} : {zoom_level} </div>
                    {/* See Mapbox documentation */}
                    <Map ref={this.mapRef} lat={this.props.lat} lng={this.props.lng} zoom={this.props.zoom} onMapChange={this.onMapChange} bearing={0} show_geocoder={true}>
                        <React.Fragment>
                            {/* TODO: Show loading indicator*/ }
                            <Source id='places' data={this.state.places_geojson} layer='places'>
                                <Layer
                                    id='heat'
                                    type='heatmap'
                                    paint={Styles.places_heatmap}
                                    isLayerChecked={true}
                                />
                                <Layer
                                    id='circles'
                                    type='circle'
                                    paint={Styles.events_circle}
                                    isLayerChecked={true}
                                />
                            </Source>

                            <Source id='lens' data={this.state.lens} layer='lens_shape'>
                                <Layer
                                    id='lens_shape'
                                    type='line'
                                    paint={Styles.lens}
                                    isLayerChecked={true}
                                />
                            </Source>
                            <Markers type='events' data={this.state.geojson} onclick={this.props.onclick} zoom={this.props.zoom}/>
                            <Markers type='places' data={this.props.nearby_places} onclick={this.props.onclick} zoom={this.props.zoom} />
                            <PhotoMarker type='places' data={this.state.photos_geojson} onclick={this.props.onclick} zoom={this.props.zoom} />
                            
                        </React.Fragment>
                            
                    </Map>
                </div>
            </div>   
        );
    }
}

EventsMap.propTypes = {
    data: PropTypes.array,
    lat: PropTypes.number,
    lng: PropTypes.number,
    bearing: PropTypes.number,
    zoom: PropTypes.number
};

const mapStateToProps = state => {
    return {
        nearby_places: state.nearby_places
    }
};

export default connect(mapStateToProps)(EventsMap);