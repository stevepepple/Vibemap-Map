import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

export default class Markers extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    before: PropTypes.string
  }

  // Thid means the object is the child of a parent with this data.
  static contextTypes = {
    map: PropTypes.object,
  }

  componentWillMount() {
    const { map } = this.context

    /*
    map.addLayer({
      id: layerId,
      source: sourceId,
      type,
      layout,
      paint: paint
    },before)
    */
    let features = this.props.data.features;
    this.addMarkers(features, map)

    console.log('map: ', map)

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
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .addTo(map);
      });
  }

  componentWillUnmount() {
    const { map } = this.context
    const { id, sourceId } = this.props
    const layerId = `${sourceId}-${id}`

    // TODO: clean up markers
    map.removeLayer(layerId)
  }

  render() {
    return null
  }
}
