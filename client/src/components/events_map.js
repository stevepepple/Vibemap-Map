import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as turf from '@turf/turf'

import Map from './map.js'
import Source from './source'
import Layer from './layer'
import Styles from '../styles/map_styles.js'
import Markers from './markers.js';

class EventsMap extends Component {

    state = {
        geojson: [],
    }

    componentDidMount(){
        let geojson = turf.featureCollection(this.props.data);

        console.log('geojson: ', geojson, this.props.data)
        this.setState({ geojson: geojson })
    }

    render() {

        let has_data = this.props.data.length > 0;
        console.log('Has data? ', has_data)

        return (
            <div>
            { has_data? (
                    <div className = 'map_container' >
                        <Map lat={this.props.lat} lng={this.props.lng} bearing={0} zoom={13}>
                            <Source id='events' data={this.state.geojson} layer='events'>
                                <Markers
                                    data={this.state.geojson}
                                />
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
    data: PropTypes.array.isRequired,
    lat: PropTypes.number,
    lng: PropTypes.number,
    bearing: PropTypes.number,
    zoom: PropTypes.number
};

export default EventsMap;