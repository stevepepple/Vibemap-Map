import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { Button, Icon, Form, Grid, Popup, Section } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'

//class EventsMap extends React.PureComponent {

class Help extends React.Component {
    state = {}

    style = {
        backgroundColor: 'white', 
        boxShadow: '0 0 0 2px rgba(0,0,0,.2)',
        position: 'absolute', 
        right: '1em', 
        bottom: '6em', 
        zIndex: 100 
    }

    togglePanel = () => this.setState((prevState) => ({ open: !prevState.open }))

    componentWillMount() {
        this.setState({ layers: this.props.layers })
    }

    render() {
        //this.props.layers.forEach(layer => console.log(layer))
        const layers = this.props.layers
        
        return (
            <Popup                
                trigger={
                    <Button 
                        circular
                        onClick={this.togglePanel}
                        size='big'
                        style={this.style} icon>
                        <Icon name='help' />
                    </Button>
                }
                on='click'
                open={this.state.open}>

                <Grid divided relaxed columns={2} textAlign='left' style={{ width: '12em' }}>
                    <h3>🖐 Hi there!</h3>
                    <p>Vibemap is like a weather map to places and experiences that match your vibe.</p>
                    <a>Read about the vibes</a>                     
                </Grid>
            </Popup>
        )
    }
}

export default Help