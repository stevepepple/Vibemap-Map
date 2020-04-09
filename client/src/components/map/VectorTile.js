import React from 'react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import isEqual from 'react-fast-compare'

import * as Constants from '../../constants.js'

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
                console.log('Setting heatmap filter: ', this.props.activity)
                this.setState({ update_layer: true, activity: this.props.activity, filter: [this.props.activity] })
            }
        }

        if (prevProps.visibility !== this.props.visibility || prevProps.layersChanged !== this.props.layersChanged || prevProps.update_layer !== this.props.update_layer) {            
            this.updateMap()
        }
    }

    addHeatMap() {
    
        const map = this._map

        let layer_options = {
            "id": this.props.id,
            "source": this.props.id + '_source',
            "source-layer": this.props.source_layer,
            "type": this.props.type,     
            "paint": this.props.paint,
            "layout": { 'visibility' : this.props.visibility }
        }

        if (this.props.filter) {
            //layer_options['filter'] = this.props.filter
        }

        let before = null
        if (this.props.id === 'heat_layer') before = 'transit_routes'

        if (map.style && map.style._loaded) {

            map.addSource(this.props.id + '_source', {
                'type': 'vector',
                'tiles': [this.props.tiles],
                'minzoom': 8
            })

            var layers = map.getStyle().layers            
                        
            map.addLayer(layer_options, before)

            let layer = map.getLayer(this.props.id)
            //console.log('Added this layer: ', this.props.id, layer)
            if (typeof layer !== 'undefined') {
                var features = map.queryRenderedFeatures({ layers: [layer.id] });
                //console.log('number of heatmap features', features)
            }            

            this.setState({ added_map: true })
        }
        //return map && map.style && map.getSource(this.id);   
    }

    updateMap() {
        let map = this._map        

        let layer = map.getLayer('heat_layer')
        if (typeof layer !== 'undefined') {
            if (this.props.filter) map.setFilter(layer.id, this.props.filter)
        }
        //this._map.setFilter('collisions', ['all', 'test']) 
        
        try {
            // TODO: this works fine but has a slight side effect that make the places layer work. 
            map.setLayoutProperty(layer.id, 'visibility', this.state.visibility); 


            for (const style in this.props.paint) {
                map.setPaintProperty(layer.id, style, this.props.paint[style]);
            };

            //map.setPaintProperty(layer.id, 'fill-color', this.props.paint);


            Object.keys(this.props.layers).map((key) => {
                let layer = map.getLayer(key)
                if (typeof layer !== 'undefined') {
                    let visibility = this.props.layers[key] ? "visible" : "none"
                    map.setLayoutProperty(key, 'visibility', visibility)
                }
                
            })            
        } catch (error) {
            console.log('problem with layer: ', error)
        }
    }

    _render(context: MapContextProps) {
        
        this._map = context.map

        if(this.state.added_map === false) {
            this.addHeatMap()
        } 
        
        if (this._map.style._loaded && this.state.update_layer) {            
            this._map.setFilter("heat_layer", this.props.filter)
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