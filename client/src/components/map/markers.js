import React, { Component } from 'react'
import helpers from '../../helpers.js'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { Marker } from 'react-map-gl'
import isEqual from 'react-fast-compare'

import Vibe from '../elements/vibe'

class Markers extends Component {

    constructor(props) {
        super(props)

        this.state = {
            markers: [],
            has_features: false
        }
    }

    componentDidMount() {        
        let has_features = (this.props.data.length > 0) ? true : false
        if (has_features) {
            this.setState({ markers: this.scoreMarkers(this.props.data) })    
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        
        let has_features = (this.props.data.length > 0) ? true : false
        let update = isEqual(this.props, prevProps)
        
        if (has_features && prevState.has_features === false) {
            this.setState({ has_features })
        }        

        if (has_features && !update) {
            // Comes from Redux state but that's not entirely clear
            this.setState({ markers: this.scoreMarkers(this.props.data)})    
        }
    }

    scoreMarkers(features) {        


        let scored_markers = features.map((feature) => {
            
            // TODO: Vibe Score and average score are confusing. 
            let score = feature.properties.average_score

            let max = helpers.getMax(features, 'average_score')
            let min = helpers.getMin(features, 'average_score')

            // Make less high scored marker in cluster smaller 
            if (feature.properties.in_cluster === true && feature.properties.top_in_cluster === 'false' ) {                
                score = max / 4
            }

            //let orginal_score = feature.properties.score
            //let vibes = feature.properties.vibes
            //let name = feature.name ? feature.name : feature.properties.name
            //let link = feature.properties.link
        
            feature.size = helpers.scaleMarker(score, min, max, this.props.zoom)
            
            feature.width = feature.size
            feature.height = feature.size

            feature.className = 'marker'
            return feature
        })

        return scored_markers
    }

    // TODO: this is a realy nice way to handle it; make a help funcition?
    handleOnMouseOver(e, feature) {
        //e.preventDefault(); // Let's stop this event.
        //e.stopPropagation();
        this.props.showPopup(feature.properties.name, feature.geometry.coordinates[1], feature.geometry.coordinates[0])
    }

    render() {

        let markers = <div></div>
        
        if (this.state.has_features) {
                        
            // TODO: @cory this
            markers = this.state.markers.map(feature => {
                    
                let in_cluster = feature.properties.in_cluster
                let top_in_cluster = feature.properties.top_in_cluster
                
                // If the marker is the top in it's cluster show a special label
                let label = null

                // top in cluster is a string/boolean because of map box styles
                if (in_cluster === false || top_in_cluster === 'true') {
                    label = <div className='label' style={{ marginTop: - (feature.height - 8) + 'px' }}>
                        <div className='name'>{feature.properties.name}</div>

                        {/* TODO: Handle event vs. place summary */}
                        <Vibe feature={feature} />
                    </div>
                }

                if (feature.id === this.props.detailsId) {
                    console.log(feature)
                }

                let selected = (feature.id === this.props.detailsId)

                // TODO: How to set z-index of parent marker based on score.
                let marker = <Marker
                    key={feature.id}
                    id={feature.id}
                    longitude={feature.geometry.coordinates[0]}
                    latitude={feature.geometry.coordinates[1]}>
                    {/* 
                    {label}   
                    */}
                    <div
                        id={feature.id}
                        title={feature.properties.name}
                        className={selected ? feature.className + ' selected' : feature.className}
                        onClick={((e) => this.props.onClick(e, feature))}
                        onMouseOver={((e) => this.handleOnMouseOver(e, feature))}
                        style={{ 
                            height: feature.height, 
                            width: feature.width,
                            marginLeft: - feature.width / 2,
                            marginTop: - feature.height / 2,
                            zIndex: feature.vibe_score
                        }}>                        
                                                
                        <img src={feature.properties.images[0]} height={'100%'} width={'100%'} />
                        
                    </div>
                </Marker>
                
                return(marker)
            })            
        }

        return (
            markers
        )
    }
}

const mapStateToProps = state => {
    return {
        detailsId: state.detailsId
    }
}

export default connect(mapStateToProps, actions)(Markers)