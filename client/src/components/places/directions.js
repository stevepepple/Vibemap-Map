import React, { Component } from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import { Button, Icon } from 'semantic-ui-react'


// Redux stuff
import { connect } from 'react-redux';
import { setName, setCurrentLocation } from '../../redux/reducer';

import * as constants from '../../constants'


class Directions extends Component {

    constructor(props) {
        super(props);

        this.state = {
            link: null,
            modes: {
                'transit' : {
                    icon: 'bus',
                    eta: '45 mins'
                },
                'walk' : {
                    icon: 'blind',
                    eta: null
                }, 
                'car' : {
                    icon: 'car', 
                    eta: null
                }
            },
            lon: this.props.data.geometry.coordinates[0],
            lat: this.props.data.geometry.coordinates[1],
            date: this.props.data.properties.date,
            address: this.props.data.properties.address,
            venue: this.props.data.properties.venue
        }
    }

    componentWillMount() {
        this.getDirections();
    }

    componentWillReceiveProps(nextProps) {

    }

    // Will set active mode: this.setState({ active_mode: event.. })
    handleClick = (event) => console.log(event) 

    getRoute(mode) {

        return new Promise((resolve, reject) => {
            let query = querystring.stringify({
                startcoord: this.props.start.lat + ',' + this.props.start.lon,
                endcoord: this.state.lat + ',' + this.state.lon,
                time: this.state.date,
                time_type: 'arrival',
                key: constants.CITY_MAPPER_SECRET
            });

            fetch("/api/directions?" + query)
                .then(data => data.json())
                .then(res => {
                    let modes = { ...this.state.modes }
                    let minutes = res.data.travel_time_minutes
                    if (minutes) {
                        modes.transit.eta = res.data.travel_time_minutes + ' mins'
                    }

                    this.setState({ modes: modes })
                }, (error) => {
                    console.log(error)
                }); 
        });
    }

    getDirections() {

        /* TODO: Handle for all modes
        let promises = []
        this.state.modes.map((mode) => promises.push( this.getRoute(mode) ))
        Promise.all(promises).then((results) => console.log(results) )
        */

        this.getRoute('transit').then((result) => console.log(result))

        // Compose Directions Link
        // API instructions are here: https://citymapper.com/tools/1053/launch-citymapper-for-directions
        let api = 'https://citymapper.com/directions/'

        let query = querystring.stringify({
            arriveby: this.state.date,
            endcoord: this.state.lat + ',' + this.state.lon,
            startaddress: this.state.address,
            endname: this.state.venue,
            set_region: 'us-sf',
        });

        let url = api + '?' + query;
        this.setState({ link : url })
    }

    render() {
        return (
            <div>
                <h3>Getting There</h3>
                <Button.Group>
                    <Button icon>
                        <Icon name='blind' />
                    </Button>
                    <Button icon active>
                        <Icon name='bus' />
                        <strong className='eta'>{this.state.modes.transit.eta}</strong>
                    </Button>
                    <Button icon>
                        <Icon name='car' />
                    </Button>

                </Button.Group>
                
                <p>This place is nearby and easy to get to. Click here for directions.</p>

                <a className='ui button primary' href={this.state.link} target='_blank'> Get Directions</a>

            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log('State from store? ', state)
    return {
        name : state.name,
        start: state.current_location
    }
};

export default connect(mapStateToProps)(Directions);