import React from 'react'
import ReactDom from 'react-dom'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'
import Tooltip from './map/tooltip'

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
      style: 'mapbox://styles/stevepepple/cjpk6due60uyh2sr2j8p8dppo',
      center: [lng, lat],
      bearing: bearing,
      zoom: zoom
    });

    this.tooltipContainer = document.createElement('div');

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [-120, 0]
    }).setLngLat([0, 0]).addTo(this.map);

    this.map.on('load', () => {
      this.setState({ map: this.map })
      this.map.addControl(new mapboxgl.NavigationControl());
      this.map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      }));


    this.map.on('mousemove', (e) => {
        /*
        const features = this.map.queryRenderedFeatures(e.point);
        tooltip.setLngLat(e.lngLat);
        this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
        this.setTooltip(features);
        */
      });

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

  setTooltip(features) {
    if (features.length) {
      ReactDom.render(
        React.createElement(
          Tooltip, {
            features
          }
        ),
        this.tooltipContainer
      );
    } else {
      this.tooltipContainer.innerHTML = '';
    }
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
