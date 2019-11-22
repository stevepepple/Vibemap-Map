import React, { Component } from 'react'
import helpers from '../../helpers.js'

import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import isEqual from 'react-fast-compare'

import Vibe from '../elements/vibe'

import Styles from '../../styles/map_styles.js'

class Markers extends Component {

    constructor(props) {
        super(props)

        this.state = {
            markers: [],
            has_features: false
        }
    }

    componentWillMount() {

    }

    componentDidMount(nextProps, nextState) {    
        
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        
        let has_features = (this.props.data.length > 0) ? true : false
        let update = isEqual(this.props, prevProps)
        
        if (has_features && prevState.has_features === false) {
            this.setState({ has_features })
        }

        if (has_features && !update) {
            this.setState({ markers: this.scoreMarkers(this.props.data)})    
        }
    }

    scoreMarkers(features) {

        let scored_markers = features.map((feature) => {
            let min_size = 20
            let max = helpers.getMax(features, 'average_score')

            let id = feature._id
            let src = feature.properties.image
            let likes = feature.properties.likes
            let score = feature.properties.average_score
            let orginal_score = feature.properties.score
            let vibes = feature.properties.vibes
            let name = feature.name ? feature.name : feature.properties.name
            let link = feature.properties.link
            
            let categories = feature.properties.categories

            // Update the size of markers based upon how well it matches the UI filter
            // TODO: Move this into core scoring function.
            let match_bonus = 10
            let vibe_matches = 0

            //console.log("compare vibes: ", vibes, current_vibes)
            // TODO: Move this to core scoring method
            if (vibes && this.props.currentVibes) {
                //console.log('Item\'s vibes: ', vibes)
                vibe_matches = helpers.matchLists(vibes, this.props.currentVibes)
            }

            let vibe_score = match_bonus * vibe_matches
            
            feature.score = score + vibe_score

            feature.size = helpers.scaleMarker(score, max, this.props.zoom)
            feature.width = feature.size + 'px'
            feature.height = feature.size + 'px'

            feature.className = 'marker'

            /*
            categories = categories.map(function (category) {
                return category.toLowerCase()
            })
            if (categories !== null) {
                feature.className = feature.className + ' ' + categories.join(' ')
            }
            */
            
            if (feature.score > 10) {
                //console.log("!!! marker score: ", feature.score)
                feature.className = feature.className + ' popular '
            }

            return feature
        })

        return scored_markers
    }

    // TODO: this is a realy nice way to handle it; make a help funcition?
    handleOnMouseOver(e, feature) {
        console.log("Hovered on marker: ", feature)
        this.props.showPopup(feature.properties.name, feature.geometry.coordinates[1], feature.geometry.coordinates[0])
    }

    render() {

        let markers = <div></div>
        
        if (this.state.has_features) {
            
            // TODO: @cory this
            markers = this.state.markers.map(feature => 
                <Marker 
                    key={feature.id} 
                    longitude={feature.geometry.coordinates[0]} 
                    latitude={feature.geometry.coordinates[1]}>
                    <div 
                        className={feature.className} 
                        onClick={((e) => this.props.onClick(e, feature))} 
                        onMouseOver={((e) => this.handleOnMouseOver(e, feature))} 
                        style={{ height: feature.height, width: feature.width}}>
                        <div className='name'>{feature.properties.name}</div>
                        <Vibe feature={feature} />
                        <img src={feature.properties.images[0]} height={'100%'} width={'100%'} />    

                    </div>                    
                </Marker>
            )            
        }

        return (
            markers
        )
    }
}

export default Markers