import React from 'react'

import * as Constants from '../../constants.js'

export default class ZoomLegend extends React.Component {
    
    render() {
        
        // Rounded for display purposes 
        let zoom_rounded = Math.round(this.props.zoom)
        // Give a sense of scale to each zoom level; rounded to whole integer
        let zoom_level = Constants.zoom_levels[zoom_rounded]
        return (
            <div id='scale'> Scale of {zoom_level}; level {zoom_rounded}</div>
        );
    }
}