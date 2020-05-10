import React, { Component } from "react";
import { render } from "react-dom";
import { Container, Dropdown, Form, Grid, Label, Message, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import isEqual from 'react-fast-compare'
import queryString from 'querystring'

import { Translation } from 'react-i18next'

import '../../styles/events_page.scss'
import styles from '../../styles/vibe_generator.scss'

import VibeMap from '../../services/VibeMap.js'

class VibeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            current: 'buzzing',
            options: [],
            placeholder: "Loading",
            colors: {
                'buzzing': { name: 'yellow', color_list: ['#FFB600', '#FDF5A7', '#FD7900'] },
                'calm': { name: 'teal', color_list: ['#9EE8B5', '#F3FED5', '#4A2BC1'] },
                'dreamy': { name: 'gray', color_list: ['#B0E3F5', '#EEEEEE', '#3B5465']},
                'oldschool': { name: 'blue', color_list: ['#EE8031', '#E0E9E6', '#181D63'] },
                'playful': { name: 'green', color_list: ['#261298', '#D03C32', '#E6E4AC'] },
                'quiet': { name: 'teal', color_list: ['rgba(95,153,241,1)', 'rgba(220,248,151,1)', 'rgba(136,235,177,1)'] },
                'together': { name: 'red', color_list: ['#DD9710', '#F4EDAE', '#8611E1'] },
                'solidarity': { name: 'teal', color_list: ['#DD9710', '#F4EDAE', '#8611E1'] },
                'wild': { name: 'purple', color_list: ['#C511D5', '#FDF5A7', '#0AAE9B'] },
                'wonderful': { name: 'blue', color_list: ['#C511D5', '#FDF5A7', '#0AAE9B'] }
            },
            vibes: []
        }
    }

    componentDidMount() {
        VibeMap.getVibes()
            .then(results => {
                this.props.setSignatureVibes(results.data['signature_vibes'])
            })

        this.setColors(this.state.current)
    }

    componentDidUpdate(prevProps, prevState) {

        if (!isEqual(prevProps.detailsId, this.props.detailsId)) {        
            this.getPlaceDetails()
        }

        if (!isEqual(prevProps.signatureVibes, this.props.signatureVibes)) {
            this.setState({ options: this.props.signatureVibes })
        }
    }

    onChange = (e, { value }) => {

        let root = document.documentElement;

        this.setState({ current: value })

        this.setColors(value)
    }

    setColors(value) {
        let colors = this.state.colors[value]['color_list']

        document.documentElement.style.setProperty('--color-1', colors[0]);
        document.documentElement.style.setProperty('--color-2', colors[1]);
        document.documentElement.style.setProperty('--color-3', colors[2]);
    }

    render() {

        let color = this.state.colors[this.state.current]['name']
        let vibes = []
        let vibe_options =[]
        let selected_vibes = []
        if (this.state.options.length > 0) {

            vibes = this.state.options.find(o => o.value === this.state.current)['vibes']
            vibe_options = vibes.map(vibe => ({ 'key': vibe, 'value': vibe, 'text' : vibe }))

            console.log('vibes for current: ', vibes, vibe_options)
            selected_vibes = vibes.map((vibe, i) => <Label className={'vibe ' + vibe} circular key={vibe} content={vibe} style={{ padding: '0.8em !important', marginBottom: '0.8em', marginRight: '0.8em' }} />)
        }
        
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
                                    {selected_vibes}
                                </Container>
                                <Translation>{
                                    (t, { i18n }) => <blockquote>
                                    <p> {t(this.state.current)} </p>
                                    </blockquote>
                                }</Translation>

                                <br/>
                                {/* 
                                <Dropdown 
                                    button 
                                    text='Pick Vibes' 
                                    selection
                                    options={vibe_options}
                                    />
                                */}
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
        detailsShown: state.detailsShown,
        signatureVibes: state.signatureVibes
    }
}

export default connect(mapStateToProps, actions)(VibeGenerator)