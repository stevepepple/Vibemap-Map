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

    
    this.addMarkers(features, map)
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

    if (update) {
      this.removeMarkers(map)
      this.addMarkers(nextProps.data.features, map);
    }
  }
  
  addMarkers(features, map) {

      let markers = features.map((feature) => {

        let src = feature.properties.image;
        let likes = feature.properties.likes;
        let link = feature.properties.link;
        let size = 30 + (0.08 * likes);

        let img = document.createElement('img');
        img.setAttribute('width', '100%');
        img.setAttribute('height', '100%');
        img.setAttribute('rel', src);

        var el = document.createElement('div');
        el.className = 'marker';
        //el.style.backgroundImage = 'url(' + src +')';
        el.style.width = size + 'px';
        el.style.height = size + 'px';

        var downloadingImage = new Image();
        downloadingImage.src = src;
        downloadingImage.onload = function () {
            img.src = this.src;
        }

        el.append(img);

        el.addEventListener('click', function () {
            window.alert(feature.properties.description);
        });

        // add marker to map
        return new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .addTo(map);
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
