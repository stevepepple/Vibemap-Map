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

  componentDidMount() {
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
        let id = feature.properties.id;
        let name = feature.properties.name;
        let link = feature.properties.link;
        let description = feature.properties.description;
        let size = 80;
        
        var el = document.createElement('div');
        el.className = 'marker photo';
        el.innerHTML = '<img src="../images/instagram.png"/>'; 
        el.title = name;
        el.setAttribute('data-id', name)

        let popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: true,
          offset: (size / 2), // shoudl be have the radius
          className: 'marker-popup'
        });

        // Reference to props from outside event handlers
        let onclick = this.props.onclick; 

        el.addEventListener('click', function (event) {
          
          onclick(id)
          
        });

        el.addEventListener('mouseover', function (event) {

          var img = document.createElement('img');
          img.src = link;
          img.width = 180;
          img.height = 180;

          let div = document.createElement('div')
          div.append(description)
          div.append(document.createElement('br'))
          div.append(img)

          popup.setLngLat(feature.geometry.coordinates)
            .setHTML(div.outerHTML)
            .addTo(map);
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
