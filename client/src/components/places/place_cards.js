import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions';

import helpers from '../../helpers.js'
import PlaceNearby from './place_nearby'

class PlaceCards extends Component {
    constructor(props) {
        super(props);

        // Helper function searchFoursquare provides the data.
        this.state = {
            result: null,
            timedOut: false,
            places : null
        }
    }

    componentWillMount() {
        console.log('PlaceNearby recieved prop', this.props)

        // First place
        let category = this.props.category;
        // Morning food breakfast coffee
        // Evening

        //TODO: Hook this up to the select vibes and cache it to the database
        let query = 'local' //art, fun, bar, food, scenic, community
        helpers.searchFoursquare(query, this.props.lat.toString() + ',' + this.props.lon.toString())
            .catch((err) => console.log(err))
            .then((results) => this.setTopandNearBy(results))
            //Set State then, get top
            .then((result) => this.setState({ result: result }))
    }

    componentWillReceiveProps(newProps) {

    }

    setTopandNearBy(results) {

        console.log("Nearby Place")
        if (results.response.groups) {
            let places = results.response.groups[0].items

            helpers.topFoursquareResult(results)
                .then((places) => {
                    console.log("All place details: ", typeof places, places.length, places)

                    this.props.setNearbyPlaces(places)
                    this.setState({ places })

                    // Save items to the database
                    //this.props.setNearbyPlaces(results)
                    /* TODO: this can be cleaner 
                    results.forEach(places => {
                        
                    });
                    result.likes = 10;
                    this.setState({ result: result })
                    places.push(this.state.result)
                    */

                })
        }
    }

    render() {
        /* TODO: come up with a better way for paginating the results */
        let top, second = null
        if (this.state.places) {
            top = this.state.places[0].properties
            second = this.state.places[1].properties
        }

        console.log('Top place: ', top)
        
        return (
            <div className='place_cards'>
                
                <Grid columns={2} columns='equal'>  
                    <Grid.Column width={8}>
                        <PlaceNearby lat={this.props.lat} lon={this.props.lon} result={top} category='restuarant'/>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <PlaceNearby lat={this.props.lat} lon={this.props.lon} result={second} category='coffee' />
                    </Grid.Column>

                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        nearby_places: state.nearby_places
    }
};

export default connect(mapStateToProps, actions)(PlaceCards);