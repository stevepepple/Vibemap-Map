import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

class Layer extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    sourceLayer: PropTypes.string,
    sourceId: PropTypes.string,
    paint: PropTypes.object,
    filter: PropTypes.array,
    layout: PropTypes.object,
    before: PropTypes.string,
    popupLabel: PropTypes.string,
    showPopup: PropTypes.bool
  }

  static contextTypes = {
    map: PropTypes.object
  }

  componentDidMount() {
    const { map } = this.context
    const {
      id,
      type,
      filter,
      sourceLayer,
      sourceId,
      layout = {},
      paint = {},
      isLayerChecked,
      before
    } = this.props

    const layerId = `${sourceId}-${id}`
    const opacity = `${type}-opacity`

    map.addLayer({
      id: layerId,
      source: sourceId,
      type,
      layout,
      filter: filter,
      paint: paint
    }, before)

    let popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    if (this.props.showPopup) {
      let popupLabel = this.props.popupLabel;

      map.on('mouseenter', layerId, function (event) {
        console.log('marker properties: ', event.features[0]['properties'])
        let coordinates = event.features[0].geometry.coordinates.slice();
        let label = event.features[0]['properties'][popupLabel]

        popup.setLngLat(coordinates)
          .setHTML(label)
          .addTo(map);
      });      
    }


    /* TODO: Remove as this was just for testing 
    let marker = new mapboxgl.Marker()
      .setLngLat([-122.40612019999999, 37.7842682])
      .addTo(map);
    */

    if(!isLayerChecked) map.setLayoutProperty(layerId, 'visibility', 'none')
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.context
    const { id, type, sourceId, isLayerChecked } = this.props
    const layerId = `${sourceId}-${id}`

    /*
    if (nextProps.sliderValue && nextProps.sliderValue !== sliderValue) {
      map.setPaintProperty(layerId, `${type}-opacity`, nextProps.sliderValue)
    }
    */
    if (nextProps.isLayerChecked !== isLayerChecked) {
      const visibility = (nextProps.isLayerChecked) ? 'visible' : 'none'
      map.setLayoutProperty(layerId, 'visibility', visibility)
    }

    return null
  }

  componentWillUnmount() {
    const { map } = this.context
    const { id, sourceId } = this.props
    const layerId = `${sourceId}-${id}`

    console.log('!!! Remove: ', sourceId, id)
    try {
      map.removeLayer(layerId)  
    } catch (error) {
      console.log("Problem trying to remove layer: ", error)
    }
    
  }

  render() {
    return null
  }
}

export default Layer;