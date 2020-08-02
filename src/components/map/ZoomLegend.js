import React, { Fragment } from 'react'

import * as Constants from '../../constants.js'

export default class ZoomLegend extends React.Component {
    
    render() {
        
        // Rounded for display purposes 
        let zoom_rounded = Math.round(this.props.zoom)
        // Give a sense of scale to each zoom level; rounded to whole integer
        let zoom_level = Constants.zoom_levels[zoom_rounded]
        return (
            <Fragment>
                <div id='scale'> Scale of {zoom_level}; level {zoom_rounded}</div>
                <div id='heatmap_scale'>
                    <span className='mild'>Mild</span>
                    <span className='wild'>Wild</span>
                </div>
            </Fragment>        
        );
    }
}