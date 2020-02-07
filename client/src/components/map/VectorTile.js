import React from 'react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { _MapContext as MapContext, MapContextProps} from 'react-map-gl'

import Styles from '../../styles/map_styles.js'

class VectorTile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            filter: ["food", "shopping", "outdoors"],
            added_map: false,
            update_layer: true
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log('getDerivedState: ', nextProps, prevState)
        if (nextProps.activity !== prevState.activity) {
            return { activity: nextProps.activity };
        } else {
            return null
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activity !== this.props.activity) {
            if (this.props.activity == 'all') {
                this.setState({ filter: ["food", "shopping", "outdoors"] })
            } else {
                this.setState({ update_layer: true, activity: this.props.activity, filter: [this.props.activity] })
            }
        }
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
                        this.state.filter,
                        true,
                        false
                    ]
                ],
                "paint": Styles.places_heatmap
            })

            /* TODO: Measure density here or get from backend with JSON tiles response. */
            //var features = map.queryRenderedFeatures({ layers: ['places'] });            

            this.setState({ added_map: true })
        }
        //return map && map.style && map.getSource(this.id);   
    }

    updateMap() {
        //this._map.setFilter('collisions', ['all', 'test'])        
    }

    _render(context: MapContextProps) {
        
        this._map = context.map

        if(this.state.added_map === false) {
            console.log("ADDING HEATMAP")
            this.addHeatMap()
        } 
        
        if (this._map.style._loaded && this.state.update_layer) {
            //this._map.setFilter("heat_layer", ['==', 'primary_category', this.state.activity])
        }
            
    }

    render() {
        return <MapContext.Consumer>{this._render.bind(this)}</MapContext.Consumer>;
    }
}

const mapStateToProps = state => ({
    activity: state.activity,
})

export default connect(mapStateToProps, actions)(VectorTile)

