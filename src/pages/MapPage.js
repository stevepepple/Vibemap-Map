import React, { Component } from "react";

import { connect } from "react-redux";
import { setCurrentLocation } from '../redux/actions'

import SEO from '../components/seo/'

import { Marker } from 'react-map-gl'

import Map from '../components/map'
import Selected from '../components/map/selected'


class MapPage extends Component {
  static async getInitialProps({ req, res, match, store }) {

    try {
      const params = req.query
      const { latitude, longitude, city } = params

      if (latitude && longitude) store.dispatch(setCurrentLocation({ latitude: latitude, longitude: longitude }))

    } catch (error) {
      console.log('Problem parsing history.')
    }
  }

  onViewportChange(viewport) {
    console.log('Viewport changed: ', viewport)
  }

  componentDidMount() {
    if (!this.props.news) {
      //this.props.dispatch(News.initialAction());
    }
  }

  render() {
    const { currentLocation, zoom } = this.props;
    return <div style={{ height : '100%'}}>
      <SEO />

      <Map
        height={'100vh'}
        width={'100vw'}
        longitude={currentLocation.longitude}
        latitude={currentLocation.latitude}
        onViewportChange={this.onViewportChange}
        zoom={zoom}>
      </Map>
    </div>
  }
}

MapPage.defaultProps = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 14
}

const mapStateToProps = state => ({
  news: state.news,
  currentLocation: state.nav.currentLocation
})


const mapDispatchToProps = dispatch => ({
  setCurrentLocation: () => dispatch(setCurrentLocation())
})

export default connect(mapStateToProps)(MapPage);