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
                {"type":"Feature","geometry":{"type":"Point","coordinates":[-122.4948301,37.78670049999999]},"properties":{"id":3,"name":"Eagle Point","description":"#landsend", "link": "https://www.instagram.com/p/BwIEEFwFfOw/?utm_source=ig_embed&amp;utm_medium=loading"}}
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

        this.setState({ geojson: geojson })

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

    createIconStyles = () => {

        let classes = {}

        Constants.all_categories.map(function (category) {

            if (category.key) {
                let image = category.icon.prefix + '32' + category.icon.suffix;
                let class_name = '.' + category.key;
                classes[class_name] = { backgroundImage: 'url(' + image + ')'}

                if(category.categories) {
                    category.categories.map(function(sub_category){
                        let sub_class_name = '.' + sub_category.key;
                        classes[sub_class_name] = { backgroundImage: 'url(' + image + ')'}

                    })
                }
            }
        })

        return classes
    }

    mapRef = React.createRef();

    render() {

        let has_places_data = this.props.events_data.length > 0;
        let has_events_data = this.props.events_data.length > 0;
        let zoom_level = Constants.zoom_levels[this.props.zoom]
        
        return (
            <div>
                <Global
                    styles={this.createIconStyles()}
                />
                <div className = 'map_container'>            
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