import React, { Component } from 'react';
import { Grid, Dropdown, Form } from 'semantic-ui-react'

import PropTypes from 'prop-types';
import * as Constants from '../../constants.js'

import LocationSearchInput from '../map/search'

import { connect } from 'react-redux'

const datePicker = {
    minWidth: '140px',
    lineHeight: '2em'
};


class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [
                { key: '1', text: '1 day', value: '1' },
                { key: '2', text: '2 days', value: '2' },
                { key: '3', text: '3 days', value: '3' },
                { key: '14', text: '2 weeks', value: '14' }
            ],

            vibe_options : []
        }
    }

    componentWillMount() {
        this.setVibeOptions()
        // TODO: remove to Redux? 
        this.setState({ activity_: Constants.activty_categories })
    }

    componentWillReceiveProps = function (props, nextProps) {
        
        this.setVibeOptions()
    }

    setVibeOptions = (props) => {
        let options = this.props.vibes.map(function (vibe) {
            return { key: vibe, value: vibe, text: vibe }
        })

        console.log("Vibes: ", options)

        this.setState({ vibe_options: options })

    }
    
    handleDaysChange = (e, { value }) => this.props.setDays({ value })

    handleActivityChange = (event, { value }) => {

        this.props.setActivity({ value })

    }

    render() {

        let search = <Form>
            <Form.Group widths='equal'>
                <LocationSearchInput className='mobile search' setPosition={this.props.setPosition} />
                <Dropdown
                    button
                    className='icon'
                    compact
                    icon='calendar'
                    labeled
                    onChange={this.handleDaysChange}
                    options={this.state.options}
                    text={this.state.options.find(obj => obj.value == this.props.days).text}
                    style={datePicker}
                />
            </Form.Group>
        </Form>

        return (
            <div>
                {this.props.isMobile? (
                    <div className='navigation mobile'>
                        {search}
                    </div>

                ) : (
                    
                    <div className='navigation'>
                            <Grid stackable stretched verticalAlign='middle'>
                            <Grid.Column width={7}>
                                {search}
                            </Grid.Column>
                            <Grid.Column width={9}>
                                {/* TODO: replace location input with search able dropdown */}
                                <Form><Form.Group>
                                        <Dropdown
                                            placeholder='Activty'
                                            search
                                            selection
                                            onChange={this.handleActivityChange}
                                            options={Constants.activty_categories}
                                        />

                                        <Dropdown
                                            placeholder='Vibe'
                                            fluid
                                            multiple
                                            compact
                                            search
                                            selection
                                            options={this.state.vibe_options}
                                        />
                                </Form.Group></Form>                                

                            </Grid.Column>
                        </Grid>
                    </div >
                )}


            </div>
        );
    }
}

Navigation.propTypes = {
    setPosition: PropTypes.function,
    setDays: PropTypes.function,
    isMobile : PropTypes.bool
};

const mapStateToProps = state => {
    console.log('store to navigation: ', state)
    return {
        nearby_places: state.nearby_places
    }
}

export default connect(mapStateToProps)(Navigation);