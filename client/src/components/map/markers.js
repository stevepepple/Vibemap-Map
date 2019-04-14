import React from 'react'
import shallowCompare from 'react-addons-shallow-compare'; // ES6

import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

export default class Markers extends React.Component {

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
    console.log('marker features: ', this.props)

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
        let id = feature._id;
        let src = feature.properties.image;
        let likes = feature.properties.likes;
        let link = feature.properties.link;
        let size = 40 + (0.18 * likes);
        
        let img = document.createElement('img');
        img.setAttribute('width', '100%');
        img.setAttribute('height', '100%');
        img.setAttribute('rel', src);


        var el = document.createElement('div');
        el.className = 'marker';
        el.title = feature.name;
        el.setAttribute('data-id', id)

        if(this.props.type === 'places') { el.className = el.className + 'place '}

        if (likes > 2) {
          el.className = el.className + ' popular '
          el.style.width = size + 'px';
          el.style.height = size + 'px';

        } else {
          el.style.width = '1.2vmin';
          el.style.height = '1.2vmin';
        }

        var downloadingImage = new Image();
        downloadingImage.src = src;
        downloadingImage.onload = function () {
            img.src = this.src;
        }

        el.append(img);

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
