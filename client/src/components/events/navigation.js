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
                { key: '1', text: '1 day', value: '1' },
                { key: '2', text: '2 days', value: '2' },
                { key: '3', text: '3 days', value: '3' },
                { key: '14', text: '2 weeks', value: '14' }
            ],
            activty_categories: [
                { key: 'all', text: 'All', value: ['art', 'arts', 'books', 'comedy', 'community', 'culture', 'free', 'health', 'local', 'nightlife', 'recurs', 'romance', 'urban']},
                { key: 'eating', text: 'Eating', value: ['food', 'restuarant'] },
                { key: 'drinking', text: 'Drinking', value: ['drinking', 'drinks'] },
                { key: 'laughing', text: 'Laughing', value: ['comedy'] },
                { key: 'stories', text: 'Telling Stories', value: ['storytelling', 'comedy']},
                { key: 'arts', text: 'Arts', value: ['arts', 'craft', 'performance'] },
                { key: 'games', text: 'Games & Sports', value: ['games', 'sports'] },
                { key: 'learning', text: 'Learning', value: ['learning', 'education'] },
                { key: 'immersive', text: 'Immersive', value: ['immersive'] },
                { key: 'music', text: 'Music', value: ['music'] },
                { key: 'outdoors', text: 'Outdoors', value: ['outdoors'] },
                { key: 'spirtual', text: 'Spirtual', value: ['spirtual'] }
            ],
            vibe_categories : [
                { key: 'community', text: 'Community', value: ['community'] },
                { key: 'family', text: 'Family', value: ['family'] },
                { key: 'festive', text: 'Festive', value: ['festive'] },
                { key: 'funny', text: 'Funny', value: ['funny'] },
                { key: 'romantic', text: 'Romantic', value: ['romantic'] }

            ]
        }
    }

    handleDaysChange = (e, { value }) => this.props.setDays({ value })

    handleActivityChange = (e, { value }) => {
        console.log('CHanged activty: ', value)
        this.props.setActivity({ value })
    }


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
                            <Grid.Column width={6}>
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
                            <Grid.Column width={9}>
                                {/* TODO: replace location input with search able dropdown */}
                                
                                <Dropdown
                                    placeholder='Activty'                                
                                    search
                                    selection
                                    onChange={this.handleActivityChange}
                                    options={this.state.activty_categories}
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