import React, { Component } from "react";

import { connect } from "react-redux";

import { Marker } from 'react-map-gl'

import Map from '../components/map'
import Selected from '../components/map/selected'


class MapPage extends Component {
  static async getInitialProps({ req, res, match, store }) {

    try {
      const params = req.query
      const { latitude, longitude, city } = params
      console.log('URL path on main: ', params)

      // Set Redux Store from URL on server so it can be used for SEO
      // Set location by city or coordinates
      if (activity) {
        store.dispatch(setActivity(activity))
        store.dispatch(lookUpActivity(activity))
      }

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
    const { longitude, latitude } = this.props;
    return <div>
      <Map
        longitude={longitude}
        latitude={latitude}
        onViewportChange={this.onViewportChange}
        zoom={15}>
        <Marker
          longitude={longitude}
          latitude={latitude}
          offsetTop={-2}
          offsetLeft={-2}>
          <Selected size={20} />
        </Marker>
      </Map>
    </div>
  }
}

const mapStateToProps = state => ({
  news: state.news
});

export default connect(mapStateToProps)(MapPage);