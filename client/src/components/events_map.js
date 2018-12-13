import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as turf from '@turf/turf'

import Map from './map.js'
import Source from './source'
import Layer from './layer'
import Styles from '../styles/map_styles.js'
import Markers from './markers.js';
//import Geocoder from "@mapbox/react-geocoder";

// TODO: load from common .env
import * as Constants from '../constants.js'

class EventsMap extends Component {

    state = {
        geojson: [],
    }

    componentDidMount(){
        let geojson = turf.featureCollection(this.props.data);

        this.setState({ geojson: geojson })
    }

    componentWillReceiveProps(){
        let geojson = turf.featureCollection(this.props.data);

        this.setState({ geojson: geojson })
    }

    onSelect = function() {
        console.log('Geocoding result: ')
    }

    mapRef = React.createRef();

    render() {

        let has_data = this.props.data.length > 0;

        return (
            <div>
            { has_data? (
                <div className = 'map_container' >
                    
                    <Map ref={this.mapRef} lat={this.props.lat} lng={this.props.lng} bearing={0} zoom={13} show_geocoder={true}>
                        <Source id='events' data={this.state.geojson} layer='events'>
                            <Markers data={this.state.geojson} />
                        </Source>
                    </Map>
                </div>
                ) : (
                <span> Loading Map</span>
            )}
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

export default EventsMap;