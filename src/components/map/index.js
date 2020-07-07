import React, { Component } from 'react';

import ReactMapGL, { Source, Layer, NavigationControl, GeolocateControl, Marker, Popup, ScaleControl } from 'react-map-gl'
import CustomMapController from './map-conroller'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

import * as Constants from '../../constants.js'
class Map extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewport: {
        width: 400,
        height: 400,
        latitude: props.latitude,
        longitude: props.longitude,
        zoom: props.zoom
      }
    }
  }

  _onViewportChange = viewport => {

    // Keep internal state
    this.setState({ viewport })

    // And call callabck, if provides
    if ('onViewportChange' in this.props) this.props.onViewportChange(viewport)
  }    

  render() {
    const { loading, height, width } = this.props
    // TODO: Map should require current item
    // const { categories, hours, address, url, is_closed } = this.props.currentItem

    const mapController = new CustomMapController()

    return (
      <div>
        { loading ? (
          <Placeholder>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder>
          ) : (
            <div>
              <ReactMapGL
                {...this.state.viewport}
                controller={mapController}
                transition={{ "duration": 300, "delay": 0 }}
                mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
                mapStyle={Constants.MAPBOX_STYLE}
                ref={this.mapRef}
                onClick={this._onClick}
                //getCursor={this._getCursor}
                onHover={this._onHover}
                onViewportChange={this._onViewportChange}
                height={height}
                width={width}
              >
                {this.props.children}
              </ReactMapGL>
            </div>
            )
        }
      </div>
    );
  }
}

Map.defaultProps = {
  loading: false,
  height: '600px',
  width: '600px',
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 12
}

export default Map;