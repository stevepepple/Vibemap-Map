import React, { Component } from 'react';
import { connect } from 'react-redux';
import { css } from '@emotion/core'

import helpers from '../../helpers.js'
import variables from '../../styles/variables.scss'

import { isAbsolute } from 'path';
import { PURPLE } from '../../constants.js';

import { Label } from 'semantic-ui-react'


class TopVibes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: 'Current Top Vibes:',
            vibes: [],
            colors: {
                chill: 'olive',
                cozy: 'orange',
                local: 'teal',
                popular: 'purple',
            }
        };

    }

    componentWillReceiveProps(nextProps) {

        let top = this.props.topVibes.slice(1, 4)

        top.map((vibe) => vibe)
        this.setState({ vibes: top })

    }


    render() {   
        
        const style = {
            padding: '1em',
            //paddingTop: '0.2em',
            fontSize: '1.1em',
        }

        let vibes = this.state.vibes.map((vibe) => <Label key={vibe} color={this.state.colors[vibe[0]]} className={'vibe label ' + vibe[0]}>{vibe[0]}<Label.Detail>{vibe[1]}</Label.Detail></Label>)

        return (
            <div id='topVibes' style={style}>
                <p>{this.state.message}</p>
                {vibes}
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    //console.log('store to weather: ', state)
    return {
        location: state.currentLocation,
        topVibes: state.topVibes
    }
};

export default connect(mapStateToProps)(TopVibes);