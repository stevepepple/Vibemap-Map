import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { Button, Checkbox, Form, Grid, Popup, Segment } from 'semantic-ui-react'
import SVG from 'react-inlinesvg'

//class EventsMap extends React.PureComponent {

class LayersFilter extends React.Component {
    state = {}

    style = {
        backgroundColor: 'white',
        boxShadow: '0 0 0 2px rgba(0,0,0,.2)',
        position: 'absolute',
        right: '1em',
        bottom: '2em',
        zIndex: 100
    }


    togglePanel = () => this.setState((prevState) => ({ open: !prevState.open }))

    toggleLayer = (e, {checked, label}) => {
        
        let layers = this.state.layers
        layers[label] = checked

        //this.setState({ layers : layers });
        this.props.setLayers(layers)
        this.props.setLayersChanged(true)
    }

    componentWillMount() {
        this.setState({ layers: this.props.layers })
    }

    render() {
        //this.props.layers.forEach(layer => console.log(layer))
        const layers = this.props.layers
        
        const rows = Object.keys(layers).map((key) => 
            <Grid.Row key={key} stretched>
                <Segment vertical>
                    <Checkbox
                        label={key}
                        onChange={this.toggleLayer}
                        checked={layers[key]} />
                </Segment>
            </Grid.Row>
        )  
    
        return (
            <Popup                
                trigger={
                    <Button 
                        circular
                        onClick={this.togglePanel}
                        style={this.style} icon>
                        <SVG style={{height: '2em', width: '2em'}} src='/images/layers.svg' />
                    </Button>
                }
                on='click'
                open={this.state.open}>

                <Grid divided relaxed columns={1} textAlign='left' style={{ width: '12em' }}>
                    <Form>  
                        {rows}                        
                    </Form>
                </Grid>
            </Popup>
        )
    }
}


const mapStateToProps = state => {
    //console.log('State in events map:', state)
    return {
        layers: state.map.layers,
        layersChanged: state.map.layersChanged
    }
}

export default connect(mapStateToProps, actions)(LayersFilter)