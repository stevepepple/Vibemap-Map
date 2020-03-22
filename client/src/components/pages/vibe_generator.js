import React, { Component } from "react";
import { render } from "react-dom";
import { Container, Dropdown, Form, Grid, Label, Message, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import isEqual from 'react-fast-compare'
import queryString from 'querystring'

import '../../styles/events_page.scss'

import VibeMap from '../../services/VibeMap.js'

class VibeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            current: 'quiet',
            options: [{
                key: 'buzzing',
                text: 'Buzzing',
                value: 'buzzing',
                vibes: ['buzzing', 'celbration', 'colorful', 'crowded', 'crazy', 'futuristic', 'innovative', 'interative', 'joyful', 'magic', 'nightlife', 'popular', 'outrageous', 'elevated']
            },{
                key: 'quiet',
                text: 'Quiet Energy',
                value: 'quiet',
                vibes: ['chill', 'cozy', 'comfy', 'rejuvenating', 'serene', 'quiet', 'peaceful', 'restorative', 'sober', 'soothing', 'dark']
            },
            {
                key: 'wild',
                text: 'Wildside',
                value: 'wild',
                vibes: ['boozy', 'alternative', 'campy', 'colorful', 'crazy', 'energy', 'fierce', 'flavorful', 'grimy', 'hip', 'intense', 'kitchy', 'kinky', 'rugged', 'public', 'outrageous', 'party']
            }],
            colors: {
                'quiet': { name: 'teal', color_list: ['rgba(95,153,241,1)', 'rgba(220,248,151,1)', 'rgba(136,235,177,1)']},
                'buzzing': { name: 'yellow', color_list: ['#FFB600', '#FDF5A7', '#FD7900']},
                'wild': { name: 'purple', color_list: ['#C511D5', '#FDF5A7', '#0AAE9B'] } 
            },
            placeholder: "Loading"
        }
    }


    componentDidUpdate(prevProps, prevState) {

        if (!isEqual(prevProps.detailsId, this.props.detailsId)) {        
            this.getPlaceDetails()
        }
    }

    onChange = (e, { value }) => {
        console.log('handleChange: ', value)

        let root = document.documentElement;

        this.setState({ current: value })

        let colors = this.state.colors[value]['color_list']

        document.documentElement.style.setProperty('--color-1', colors[0]);
        document.documentElement.style.setProperty('--color-2', colors[1]);
        document.documentElement.style.setProperty('--color-3', colors[2]);
    }

    render() {
        let colors = { 
            'quiet' : 'teal',
            'vibrant': 'orange'
        }

        let color = colors[this.state.current]

        let vibes = this.state.options.find(o => o.value === this.state.current)['vibes']
        console.log("vibes: ", vibes)
        return (
            <Grid columns='equal' style={{ paddingTop: '8%'}}>
                <Grid.Column>
                    <Segment basic>                        
                    </Segment>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Segment padded>                    
                        <Grid columns='equal'>
                            <Grid.Column width={6}>   
                                <Form size='small'>
                                    <Form.Field>
                                        <Dropdown
                                            onChange={this.onChange}
                                            text={this.state.current.toUpperCase()}                                            
                                            value={this.state.current} 
                                            button                                           
                                        >
                                            <Dropdown.Menu>
                                                {this.state.options.map((option) => (
                                                    <Dropdown.Item key={option.value} onClick={this.onChange} text={option.text} value={option.value} />
                                                ))}                                                
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <Label className={'ui circular label ' + color} style={{ marginLeft: '2em' }} />                                    
                                    </Form.Field>            
                                </Form>
                                <br/>
                                <Container>
                                    <p>{vibes.map((vibe) =>
                                        <span>{vibe + ' '}</span>
                                    )}</p>
                                </Container>
                                <br/>
                                <Dropdown button text='Pick Vibes' selection/>
                                
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Segment padded style={{ height: '66vmin'}}>
                                    <div className='video'></div>
                                    <div className='color'></div>                                    
                                </Segment>
                            </Grid.Column>
                        </Grid>
                    </Segment>
                    
                    
                </Grid.Column>
                <Grid.Column>
                    <Segment basic></Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = state => {

    return {
        currentPlace: state.currentPlace,
        detailsId: state.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown
    }
}

export default connect(mapStateToProps, actions)(VibeGenerator)