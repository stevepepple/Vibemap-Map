import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Segment } from 'semantic-ui-react'

import PlaceNearby from './place_nearby'


class PlaceCards extends Component {

    render() {
        return (
            <div className='place_cards'>
                
                <Grid columns={2} columns='equal'>  
                    <Grid.Column width={8}>
                    {/*
    <PlaceNearby lat={this.props.lat} lon={this.props.lon} category='restuarant'/>

                    */}
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {/*
                        <PlaceNearby lat={this.props.lat} lon={this.props.lon} category='coffee' />
                        */}
                    </Grid.Column>

                </Grid>
            </div>
        );
    }
}


export default PlaceCards;