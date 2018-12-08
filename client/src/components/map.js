import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

// TODO: pass from config
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmVwZXBwbGUiLCJhIjoiTmd4T0wyNCJ9.1-jWg2J5XmFfnBAhyrORmw';

let Map = class Map extends React.Component {
  map;

  static childContextTypes = {
    map: PropTypes.object
  }

  getChildContext = () => ({
    map: this.state.map
  })

  constructor(props) {
    super(props);    

    this.state = {
      lat: props.lat !== 'undefined' !== null ? props.lat: 37.805308,
      lng: props.lng !== 'undefined' ? props.lng : -122.2708464,
      zoom: typeof props.zoom !== 'undefined' ? props.zoom : 13,
      bearing: typeof props.bearing !== 'undefined' ? props.bearing : 28,
      map: null,
      value: 'all',
      show_events: true,
      show_places: true,
      show_cluster: false
    };
    this.updateParent = this.updateParent.bind(this)
  }

  componentDidUpdate() {
    console.log(this.state.map)
  }

  componentDidMount() {
    const { lng, lat, bearing, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/stevepepple/cihazstxs005l4llzl0jn7pyc',
      center: [lng, lat],
      bearing: bearing,
      zoom: zoom
    });

    this.map.on('load', () => {
      this.setState({ map: this.map })
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));

      /*
      // Show Places
      this.map.addLayer({
          id: 'places-2',
          type: 'circle',
          source: 'places_source',
          'layout': { 'visibility': this.state.show_places ? 'visible' : 'none' },
          minzoom: 10,
          paint: {
            'circle-radius': [
            'interpolate',
            ['exponential', 3],
            ["zoom"],
            3, ['*', 0.5, ['to-number', ['get', 'rating']]],
            12, ['*', 1, ['to-number', ['get', 'rating']]],
            18, ['*', 10, ['to-number', ['get', 'rating']]]],

            'circle-color': 'rgb(121, 76, 138)',
            'circle-stroke-color': 'white',
            'circle-stroke-width': {
              stops: [
              [12, 0.5],
              [18, 4.0]] },

            'circle-opacity': {
              stops: [[10, 0.0], [12, 0.4], [13, 0.6], [18, 1.0]] },

            'circle-stroke-opacity': {
              stops: [[10, 0.0], [12, 0.4], [13, 0.6], [18, 1.0]] } }
        });
        */

      /*
      this.map.addSource('countries', {
        type: 'geojson',
        data: this.props.data
      });

      // TODO: this will be the hotspots
      this.map.addLayer({
        id: 'countries',
        type: 'fill',
        source: 'countries'
      }, 'country-label-lg'); // ID metches `mapbox/streets-v9`
      */
    });

  }

  updateParent(field) {
    console.log("updateParent: ", field);
    this.setState({value: field});
  }

  setFilter(filter) {
    //map.setFilter('places', filter);
    this.map.setFilter('places-2', filter);
  }

  setFill() {
    const { property, stops } = this.props.active;
    this.map.setPaintProperty('countries', 'fill-color', {
      property,
      stops
    });
  }

  render() {
    const { children } = this.props
    const { map } = this.state
    return (
      <div className='map' ref={(x) => { this.mapContainer = x }} className='left'>
        { map && children }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    data: state.data,
    active: state.active
  };
}

export default Map;
