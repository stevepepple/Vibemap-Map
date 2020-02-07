import React, { Component } from 'react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { Translation } from "react-i18next";

import { Label, Placeholder } from 'semantic-ui-react'


class TopVibes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: 'Current Vibe:',
            vibes: [],
            colors: {
                chill: 'olive',
                cozy: 'orange',
                local: 'teal',
                popular: 'purple',
            }
        }
    }

    componentWillReceiveProps(nextProps) {

        let top = this.props.topVibes.slice(1, 4)

        top.map((vibe) => vibe)
        this.setState({ vibes: top })

    }

    handleClick = (e, vibe) => {        
        let combinedVibes = []

        combinedVibes.concat(this.props.currentVibes)
        
        // Only add vibes that haven't been added.
        if (combinedVibes.indexOf(vibe) < 0) combinedVibes.push(vibe)

        this.props.setCurrentVibes(combinedVibes)
    }

    render() {   
        
        const style = {
            //padding: '1em',
            //paddingTop: '0.2em',
            fontSize: '1.1em',
        }

        
        let vibes = this.state.vibes.map((vibe) => <Label key={vibe[0]} onClick={((e) => this.handleClick(e, vibe[0]))} color={this.state.colors[vibe[0]]} title={'clickToAdd'} className={'vibe label ' + vibe[0]}>{vibe[0]}<Label.Detail>{vibe[1]}</Label.Detail></Label>)

        return (
            <div id='topVibes' style={style}>
            
                <Label size='small' pointing='right'>                    
                    <Translation i18nKey="CurrentVibe">
                        {(t, { i18n }) => <p>{t("CurrentVibe")}</p>}
                    </Translation>
                </Label>
                
                { /* Show loading if vibes aren't there*/
                vibes.length > 0 ? (
                    vibes
                ) : (                    
                    <Placeholder style={{ display: 'inline', float: 'right', width: '8em'}} ><Placeholder.Line length='short'/></Placeholder>
                )}            
                
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    //console.log('store to weather: ', state)
    return {
        location: state.currentLocation,
        currentVibes: state.currentVibes,
        topVibes: state.topVibes
    }
};

export default connect(mapStateToProps, actions)(TopVibes);