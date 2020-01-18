import React, { PureComponent } from 'react'
import ReactMapGL from 'react-map-gl'

import { _MapContext as MapContext, MapContextProps} from 'react-map-gl'


class VectorTile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            markers: [],
            has_features: false,
            added_map: false
        }
    }

    componentWillMount() {

    }

    addHeatMap() {
    
        const map = this._map

        if (map.style && map.style._loaded) {
            const MAX_ZOOM_LEVEL = 9;

            map.on('load', function () {

                map.addLayer({
                    'id': 'terrain-data',
                    'type': 'line',
                    'source': {
                        type: 'vector',
                        url: 'mapbox://mapbox.mapbox-terrain-v2'
                    },
                    'source-layer': 'contour',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#ff69b4',
                        'line-width': 1
                    }
                });

                map.addLayer(
                    {
                        'id': 'mapillary',
                        'type': 'heatmap',
                        'source': {
                            'type': 'vector',
                            'tiles': [
                                //'https://tiles.vibemap.com/maps/places/{z}/{x}/{y}.mvt'
                                'https://d25uarhxywzl1j.cloudfront.net/v0.1/{z}/{x}/{y}.mvt'
                            ],
                            'minzoom': 6,
                            'maxzoom': 14
                        },
                        'source-layer': 'mapillary-sequences'
                    }
                );

                map.addSource('tile_layer', {
                    'type': 'vector',
                    'tiles': ["https://tiles.vibemap.com/maps/places/{z}/{x}/{y}.mvt"],
                    'minzoom' : 8
                })
                
                map.addLayer({
                    "id": "heat_layer",
                    "source": "tile_layer",
                    "source-layer": "tile_layer",
                    "type": "circle",                    
                })
                
            })

            this.setState({ added_map: true })
        }
        //return map && map.style && map.getSource(this.id);
        
    }

    _render(context: MapContextProps) {
        if (!this.map) {
            this._map = context.map

            if(this.state.added_map === false) {
                this.addHeatMap()
            }

            //this._map.on('styledata', this._updateLayer);
        }
        return null;
    }

    render() {
        return <MapContext.Consumer>{this._render.bind(this)}</MapContext.Consumer>;
    }

}

export default VectorTile