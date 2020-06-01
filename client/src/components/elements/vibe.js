import React from 'react'

import chroma from 'chroma-js'

import * as style_variables from 'vibemap-constants/design-system/build/json/variables.json';

export default class Vibe extends React.Component{

    constructor(props) {
        super(props)

        this.state = {
            vibe: ""
        }

    }
    componentWillMount() {

        // TODO: @cory once there's a vibe attribute it will be connected to this component.
        let feature = this.props.feature
        let vibe = this.props.vibe
        
        if (this.props.vibe) {
            this.setState({ vibe })
        }
        else if (feature.properties.vibes && feature.properties.vibes.length > 0) {
            let vibes = feature.properties.vibes
            let vibe = vibes[vibes.length - 1]

            this.setState({ vibe })
        } else {
            return null
        }
    }

    render() {
        let { vibe } = this.state

        return (
            <div className="vibe">
                {vibe}
            </div>
        )
    }
    
};
