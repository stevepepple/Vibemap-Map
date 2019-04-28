import React from 'react'
import helpers from '../../helpers.js'

import shallowCompare from 'react-addons-shallow-compare'; // ES6

import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

export default class Markers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      markers : [],
      popups: [],
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
      let min_size = 32;
      // Create a scale based uopn the ranking score
      let max = helpers.getMax(features, 'score')

      let markers = features.map((feature) => {

        //TODO: write a reusable util function for geojson feature to object.
        let id = feature._id;
        let src = feature.properties.image;
        let likes = feature.properties.likes;
        let score = feature.properties.score;
        let vibes = feature.properties.vibes;
        let name = feature.name ? feature.name : feature.properties.name;
        let link = feature.properties.link;
        let categories = feature.properties.categories;

        // Scale the marker based on score and zoom
        let size = helpers.scaleMarker(score, max, map.getZoom());

        let img = document.createElement('img');
        img.setAttribute('width', '100%');
        img.setAttribute('height', '100%');
        img.setAttribute('rel', src);

        var el = document.createElement('div');
        el.className = 'marker';
        if (categories !== null) {
          el.className = el.className + ' ' + categories.join(' ')
        }
        //el.title = name;
        el.setAttribute('id', id)
        el.setAttribute('data-id', id)
        el.setAttribute('data-title', name)


        el.style.width = size + 'px';
        el.style.height = size + 'px';

        if(this.props.type === 'places') { 
          el.className = el.className + ' ' + 'place';
        }

        if (likes > 2) {
          el.className = el.className + ' popular '
        }

        // TODO: figure out a better way to cache image and reduce memory usage
        // TODO: also load image on hover, if it's note highly ranked
        let image = new Image();          

        // TODO: Figure out threashold for popularity and rating...
        if (size > (min_size * 1.8)  ) {

          // TODO: Make this reusable
          el.className = el.className + ' popular '

          image.src = src;

          el.append(img);
          image.onload = function () {
            img.src = this.src;
          }
        }

        // Create a popup, but don't add it to the map yet.
        let popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: true,
          offset: (size / 2), // shoudl be have the radius
          className: 'marker-popup'
        });

        let joined = this.state.popups.concat(popup);
        this.setState({ popups: joined })
        
        // Reference to props from outside event handlers
        let onclick = this.props.onclick; 

        // This is triggered by the hover event in the list
        el.addEventListener('focus', function (event) {
          popup.setLngLat(feature.geometry.coordinates)
            .setHTML(name)
            .addTo(map);

          el.style.width = (size * 1.4) + 'px';
          el.style.height = (size * 1.4) + 'px';

        })


        el.addEventListener('mouseover', function (event) {
          
          popup.setLngLat(feature.geometry.coordinates)
            .setHTML(name)
            .addTo(map);
            
          el.style.width = (size * 1.6) + 'px';
          el.style.height = (size * 1.6) + 'px';

          image.src = src;

          el.append(img);
          image.onload = function () {
            img.src = this.src;
          }

        });

        // Reference outside of event
        //let removePopups = this.removePopups

        el.addEventListener('mouseleave', function () {
          console.log("received mouse leave event")
          map.getCanvas().style.cursor = '';
          popup.remove();
          //removePopups();

          el.style.width = size  + 'px'
          el.style.height = size + 'px'

        });

        el.addEventListener('click', function (event) {
          // TODO: Handle unintential clicks on map
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

  removePopups(map) {
    this.state.popups.forEach(popup => {
        popup.remove();
    });
  }

  componentWillUnmount() {
    
    this.removeMarkers();

  }

  render() {
    return null
  }
}
