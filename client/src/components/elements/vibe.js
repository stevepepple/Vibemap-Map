import React from 'react'

export default class Vibe extends React.Component{

    componentWillMount() {
        
        // TODO: @cory once there's a vibe attribute it will be connected to this component.
        let feature = this.props.feature
        
        if (feature.properties.vibes && feature.properties.vibes.length > 0) {
            let vibes = feature.properties.vibes
            let vibe = vibes[vibes.length - 1]
            this.setState(vibe)
        } else {
            return null
        }
    }

    render() {
        return (
            <div className="vibe">
                
            </div>
        )
    }
    
};