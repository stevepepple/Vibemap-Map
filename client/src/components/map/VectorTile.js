import React from 'react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { _MapContext as MapContext, MapContextProps} from 'react-map-gl'

import Styles from '../../styles/map_styles.js'

class VectorTile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            filter: "any",
            markers: [],
            has_features: false,
            added_map: false
        }
    }

    componentWillMount() {
        const options = Object.assign({}, this.props);
        console.log('New Heatmap props ', this.props)
    }

    addHeatMap() {
    
        const map = this._map

        if (map.style && map.style._loaded) {
            const MAX_ZOOM_LEVEL = 9

            map.addSource('tile_layer', {
                'type': 'vector',
                'tiles': ["https://tiles.vibemap.com/maps/places/{z}/{x}/{y}.mvt"],
                'minzoom': 8            
            })
            
            map.addLayer({
                "id": "heat_layer",
                "source": "tile_layer",
                "source-layer": "places",
                "type": "heatmap",
                'filter': [
                    "all",
                    [
                        "match",
                        ["get", "primary_category"],
                        [this.props.activity],
                        true,
                        false]
                ],
                "paint": Styles.places_heatmap
            }, 'places')

            /* TODO: Measure density here or get from backend with JSON tiles response. */
            var features = map.queryRenderedFeatures({ layers: ['places'] });
            console.log('This many features: ', features)


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

const mapStateToProps = state => ({
    activity: state.activity,
})

export default connect(mapStateToProps, actions)(VectorTile)

