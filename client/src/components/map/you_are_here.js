import React from 'react'
import PropTypes from 'prop-types'
import mapboxgl from 'mapbox-gl'

export default class YouAreHere extends React.Component {

    // Thid means the object is the child of a parent with this data.
    static contextTypes = {
        map: PropTypes.object,
    }

    componentDidMount() {
        const { map } = this.context;

        var el = document.createElement('div');
        el.className = 'here';
        el.innerHTML = 'YOU';

        // add marker to map        
        let marker = new mapboxgl.Marker(el)
            .setLngLat([this.props.lng, this.props.lat])
            .addTo(map);
        
        let initialRadius = 8;
        let framesPerSecond = 15;
        let initialOpacity = 0.5
        let opacity = initialOpacity;
        let radius = initialRadius;
        let maxRadius = 50;
        
        // Animated dot goes here. 

        map.addSource('point', {
            "type": "geojson",
            "data": {
                "type": "Point",
                "coordinates": [
                    this.props.lng, this.props.lat
                ]
            }
        });

        map.addLayer({
            "id": "point",
            "source": "point",
            "type": "circle",
            "paint": {
                "circle-radius": initialRadius,
                "circle-radius-transition": { duration: 0 },
                "circle-opacity-transition": { duration: 0 },
                "circle-color": "#66B5F8"
            }
        });

        let animateMarker = function(){

            setTimeout(function () {
                requestAnimationFrame(animateMarker);

                radius += (maxRadius - radius) / framesPerSecond;
                opacity -= (opacity / framesPerSecond);

                map.setPaintProperty('point', 'circle-radius', radius);
                map.setPaintProperty('point', 'circle-opacity', opacity);

                if (opacity <= 0) {
                    radius = initialRadius;
                    opacity = initialOpacity;
                }

            }, 3000 / framesPerSecond);

        }
        // Start the animation.
        animateMarker();

        console.log('ready to map: ', map, this.props)
    }

    render() {
        
        return null;
    }
}