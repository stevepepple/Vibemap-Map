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
            update_layer: true,
            visibility: "visible"
        }
    }

    // TODO: Important: Use this in other modules; as other life cylce methonds are deprecated
    static getDerivedStateFromProps(nextProps, prevState){    
        
        if (nextProps.visibility !== prevState.visibility) {
            return { visibility: nextProps.visibility}
        }

        if (nextProps.activity !== prevState.activity) {
            return { activity: nextProps.activity };
        } else {
            return null
        }
    }
        
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activity !== this.props.activity) {
            if (this.props.activity === 'all') {
                this.setState({ filter: ["food", "shopping", "outdoors"] })
            } else {
                this.setState({ update_layer: true, activity: this.props.activity, filter: [this.props.activity] })
            }
        }

        if (prevProps.visibility !== this.props.visibility || prevProps.layersChanged !== this.props.layersChanged) {   
            this.updateMap()
        }
    }

    addHeatMap() {
    
        const map = this._map

        if (map.style && map.style._loaded) {

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
                "paint": Styles.places_heatmap,
                //"layout": { 'visibility' : this.state.visibility }
            })

            /* TODO: Measure density here or get from backend with JSON tiles response. */
            //var features = map.queryRenderedFeatures({ layers: ['places'] });            

            this.setState({ added_map: true })
        }
        //return map && map.style && map.getSource(this.id);   
    }

    updateMap() {
        let map = this._map        

        let layer = map.getLayer('heat_layer')

        //this._map.setFilter('collisions', ['all', 'test']) 
        //map.setFilter(layer.id, ['==', 'primary_category', this.state.activity])

        // TODO: this works fine but has a slight side effect that make the places layer work. 
        map.setLayoutProperty(layer.id, 'visibility', this.state.visibility);

        console.log('layers changed: ', this.props.layers)

        Object.keys(this.props.layers).map((key) => {
            let visibility = this.props.layers[key]  ? "visible" : "none"
            map.setLayoutProperty(key, 'visibility', visibility);
        })
            
       
    }

    _render(context: MapContextProps) {
        
        this._map = context.map

        if(this.state.added_map === false) {            
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
    layers: state.layers,
    layersChanged: state.layersChanged
})

export default connect(mapStateToProps, actions)(VectorTile)