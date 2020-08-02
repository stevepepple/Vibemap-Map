import React, { Component } from "react";
import { Container, Dropdown, Form, Grid, Label, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import isEqual from 'react-fast-compare'

import chroma from 'chroma-js'

import * as style_variables from 'vibemap-constants/design-system/build/json/variables.json';

import { Translation } from 'react-i18next'

import '../../styles/events_page.scss'

import styles from '../../styles/vibe_generator.scss'
import vibe_styles from '../../styles/vibes.scss'

import VibeMap from '../../services/VibeMap.js'

class VibeGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            current: 'buzzing',
            current_vibe: null,
            options: [],
            placeholder: "Loading",
            colors: {
                'calm': { name: 'teal', title: 'Quiet Engergy', color_list: ['#9EE8B5', '#F3FED5', '#4A2BC1'] },
                'dreamy': { name: 'gray', color_list: ['#B0E3F5', '#EEEEEE', '#3B5465']},
                'oldschool': { name: 'blue', color_list: ['#EE8031', '#E0E9E6', '#181D63'] },
                'playful': { name: 'green', color_list: ['#261298', '#D03C32', '#E6E4AC'] },
                'quiet': { name: 'teal', color_list: ['rgba(95,153,241,1)', 'rgba(220,248,151,1)', 'rgba(136,235,177,1)'] },
                'together': { name: 'red', color_list: ['#DD9710', '#F4EDAE', '#8611E1'] },
                'solidarity': { name: 'teal', color_list: ['#DD9710', '#F4EDAE', '#8611E1'] },
                'wild': { name: 'purple', color_list: ['#C511D5', '#FDF5A7', '#0AAE9B'] },
                'wonderful': { name: 'blue', color_list: ['#C511D5', '#FDF5A7', '#0AAE9B'] },
                'buzzing': { name: 'yellow', title: 'Buzzing', color_list: ['#7D7C84', '#FDF5A7', '#FD7900'] },

            },
            vibes: []
        }
    }

    componentDidMount() {
        VibeMap.getVibes()
            .then(results => {
                this.props.setVibesets(results.data['signature_vibes'])
            })

        this.setColors(this.state.current)
    }

    componentDidUpdate(prevProps, prevState) {

        if (!isEqual(prevProps.detailsId, this.props.detailsId)) {        
            this.getPlaceDetails()
        }

        if (!isEqual(prevProps.vibesets, this.props.vibesets)) {
            this.setState({ options: this.props.vibesets })
        }
    }

    onChange = (e, { value }) => {
        
        this.setState({ current: value })
        this.setColors(value)
    }

    onVibeClick = (e, vibe) => {
        let vibe_styles = style_variables['default']['color']['vibes']

        let primary = null; 
        let secondary = null;

        if (vibe in vibe_styles) {
            primary = vibe_styles[vibe]['primary']
            secondary = vibe_styles[vibe]['secondary']
        }

        this.setState({ current_vibe: vibe, vibe_color_primary: primary, vibe_color_secondary: secondary})
    }

    getVibeStyles = (vibe, isActive) => {
        let vibe_styles = style_variables['default']['color']['vibes']
        
        let css = { padding: '1.8em !important', marginBottom: '0.8em', marginRight: '0.8em' }

        try {
            if (vibe in vibe_styles) {
                let primary = vibe_styles[vibe]['primary']
                let secondary = vibe_styles[vibe]['secondary']

                let gray = style_variables['default']['color']['base']['gray']['500']
                let light_gray = style_variables['default']['color']['base']['gray']['300']

                //let white = style_variables['default']['color']['base']['gray']['50']

                if (isActive) {
                    let luminance = chroma(primary).luminance()
                    let brightness = 1.2
                    if (luminance < 0.1) brightness += 2
                    if (luminance < 0.3) brightness += 1

                    
                    console.log('luminance: ', luminance, brightness)
                    let gradient = 'linear-gradient(45deg, ' + chroma(primary).brighten(brightness).hex() + ' 0%, ' + light_gray + ' 75%)'
                    console.log(gradient)
                    css['color'] = '#222222'
                    css['background'] = gradient
                    css['borderColor'] = chroma.mix(primary, gray)
                    css['borderWidth'] = '1.5px'
                    //this.setState({ vibe_color_primary: primary, vibe_color_secondary: secondary })
                } else {
                    css['borderColor'] = chroma.mix(primary, gray)
                    css['borderWidth'] = '1.5px'
                }

            }

        } catch (error) {
            console.log('Problem: ', error)
        }

        console.log('Styles for: ', vibe, vibe_styles)

        return css
    }

    getColors(vibes) {
        let colors = []
        let vibe_styles = style_variables['default']['color']['vibes']

        vibes.map(vibe => {
            if (vibe in vibe_styles) {
                colors.push(vibe_styles[vibe]['primary']) 
            }

            return null
        })
        
        return colors
    }

    setColors(value) {
        let primary = null
        let secondary = null
        let tertiary = null

        let vibe_styles = style_variables['default']['color']['vibes']

        console.log('Set colors for: ', value)

        if (value in vibe_styles) {
            primary = vibe_styles[value]['primary']
            secondary = vibe_styles[value]['secondary']
            tertiary = vibe_styles[value]['tertiary']

            console.log('Primary for set: ', primary, secondary, tertiary)

        }

        let colors = this.state.colors[value]['color_list']

        if (primary === null) primary = colors[0]
        if (secondary === null) secondary = colors[1]
        if (tertiary === null) tertiary = colors[2]

        this.setState({ vibeset_color_primary: primary, vibeset_color_secondary: secondary, vibeset_color_tertiary: tertiary })

        document.documentElement.style.setProperty('--color-1', primary)
        document.documentElement.style.setProperty('--color-2', tertiary)
        document.documentElement.style.setProperty('--color-3', secondary)
    }

    render() {
        let { vibe_color_primary, vibeset_color_primary, vibe_color_secondary, vibeset_color_tertiary, vibeset_color_secondary } = this.state

        let color = this.state.colors[this.state.current]['name']
        let vibes = []
        let vibe_options =[]
        let vibe_colors = []
        let selected_vibes = []

        if (this.state.options.length > 0) {

            vibes = this.state.options.find(o => o.value === this.state.current)['vibes']
            vibe_options = vibes.map(vibe => ({ 'key': vibe, 'value': vibe, 'text' : vibe }))

            vibe_colors = this.getColors(vibes)

            console.log('vibe colors: ', vibe_colors)

            /* TODO: Make Vibe a components */
            selected_vibes = vibes.map((vibe, i) => {
                let className = 'vibe ' + vibe
                const isActive = vibe === this.state.current_vibe 
                if (isActive) className += ' active'
                return <Label 
                        className={className} 
                        circular key={vibe} content={vibe} 
                        onClick={((e) => this.onVibeClick(e, vibe))} 
                        style={this.getVibeStyles(vibe, isActive)} />
            })
        }

        let primary_color_mixed = vibeset_color_primary
        let secondary_color_mixed = vibe_color_secondary
        let tertiary_color_mixed = vibeset_color_tertiary

        let primary_average = '#FFFFFF'

        if (vibe_colors.length > 0) primary_average = chroma.average(vibe_colors, 'lch').hex(); 

        if (vibeset_color_primary && vibe_color_primary) {
            primary_color_mixed = chroma.mix(vibeset_color_primary, vibe_color_primary, 0.5, 'lab').hex()
            secondary_color_mixed = chroma.mix(vibeset_color_secondary, vibe_color_secondary, 0.5, 'lab').hex()
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
                                <div>
                                    <p>Average of vibe colors:</p>                                
                                    <div style={{ width: '3em', height: '3em', backgroundColor: primary_average }}></div>

                                    <p>Mix of vibeset and selected:</p>                                    
                                    <div style={{ width: '3em', height: '3em', backgroundColor: primary_color_mixed }}></div>
                                    <div style={{ width: '3em', height: '3em', backgroundColor: secondary_color_mixed }}></div>
                                    <div style={{ width: '3em', height: '3em', backgroundColor: tertiary_color_mixed }}></div>
                                    
                                </div>
                                
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
        detailsId: state.places.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown,
        vibesets: state.nav.vibesets
    }
}

export default connect(mapStateToProps, actions)(VibeGenerator)