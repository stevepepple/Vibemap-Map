import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'; // ES6

import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

export default class PhotoMarker extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      markers : [],
      map: null
    }
  }

  static propTypes = {
    before: PropTypes.string
  }

  // Thid means the object is the child of a parent with this data.
  static contextTypes = {
    map: PropTypes.object,
  }

  componentWillMount() {
    const { map } = this.context

    let features = this.props.data.features;

    if (features != null && features.length > 0) {
      this.addMarkers(features, map)
    }
  }

  componentDidUpdate() {
  }

  shouldComponentUpdate(nextProps, nextState) {

    let update = shallowCompare(this, nextProps, nextState);
    return update;
    
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.context

    let update = shallowCompare(this.props, nextProps)

    if (update && nextProps.data.features) {
      this.removeMarkers(map)
      this.addMarkers(nextProps.data.features, map);
    }
  }
  
  addMarkers(features, map) {

      let markers = features.map((feature) => {

        //TODO: write a reusable util function for geojson feature to object.
        let link = feature.properties.link;
        let id = feature.properties.id;
        let name = feature.properties.name;
        let size = 80;
        
        var el = document.createElement('div');
        el.className = 'marker photo';
        el.innerHTML = '📷'; 
        el.title = name;
        el.setAttribute('data-id', name)

        // Reference to props from outside event handlers
        let onclick = this.props.onclick; 

        el.addEventListener('click', function (event) {
          
          onclick(id)
          
        });

        // add marker to map        
        let marker = new mapboxgl.Marker(el)
          .setLngLat(feature.geometry.coordinates)
          .addTo(map);
           
        return marker;
      });

      this.setState({ markers : markers})
  }

  removeMarkers(map) {
    this.state.markers.forEach(marker => {
      marker.remove();
    });
  }

  componentWillUnmount() {
    
    this.removeMarkers();

  }

  render() {
    return null
  }
}
