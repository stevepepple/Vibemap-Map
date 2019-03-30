import React, { Component } from 'react';
import { Grid, Dropdown } from 'semantic-ui-react'

import PropTypes from 'prop-types';

import LocationSearchInput from '../map/search'

import { connect } from 'react-redux'

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: [
                { key: 'one', text: '1 day', value: '1' },
                { key: 'two', text: '2 days', value: '2' },
                { key: 'three', text: '3 days', value: '3' }
            ]
        }
    }

    handleDaysChange = (e, { value }) => this.props.setDays({ value })

    render() {
        return (
            <div>
                {this.props.isMobile? (
                    <div className='navigation mobile'>
                        <h3 className="header">Happening Near You</h3>
                        <LocationSearchInput className='mobile search' setPosition={this.props.setPosition} />     
                    </div>

                ) : (

                    <div className='navigation'>
                        <Grid stackable verticalAlign='middle'>
                            <Grid.Column width={5}>
                                <h3 className="header">Happening Near You</h3>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                {/* TODO: replace location input with search able dropdown */}
                                <LocationSearchInput setPosition={this.props.setPosition} />
                                <Dropdown 
                                    button
                                    className='icon'
                                    compact
                                    icon='calendar'
                                    labeled 
                                    onChange={this.handleDaysChange} 
                                    options={this.state.options} 
                                    text={this.state.options.find(obj => obj.value == this.props.days).text}
                                />

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