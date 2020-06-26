import React, { Component } from 'react';

import querystring from 'querystring';
import { Button, Icon, Segment } from 'semantic-ui-react'


// Redux stuff
import { connect } from 'react-redux';
import * as constants from '../../constants.js'

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
            }            
        }
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.detailsShown === true && this.props.currentPlace.location) {
            this.getDirections()
        } 
        
    }

    // Will set active mode: this.setState({ active_mode: event.. })
    handleClick = (event) => console.log(event) 

    getRoute(mode) {

        return new Promise((resolve, reject) => {
            let query = querystring.stringify({
                startcoord: this.props.currentLocation.latitude + ',' + this.props.currentLocation.longitude,
                endcoord: this.props.currentPlace.location.latitude + ',' + this.props.currentPlace.location.longitude,
                time: new Date(),
                time_type: 'arrival',
                key: constants.CITY_MAPPER_SECRET
            })

            // Was /api/directions
            fetch("/api/directions?" + query)
                .then(data => data.json()) // Was: data.json()
                .then(res => {
                    console.log('City Mapper Response: ', res)
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

        console.log("Current Place !!!", this.props.currentPlace)

        let query = querystring.stringify({
            arriveby: this.state.date,
            startcoord: this.props.currentLocation.latitude + ',' + this.props.currentLocation.longitude,
            endcoord: this.props.currentPlace.location.latitude + ',' + this.props.currentPlace.location.longitude,
            //startaddress: this.state.address,
            //endname: this.state.venue,
            //set_region: 'us-sf',
        });

        let url = api + '?' + query;

        console.log('Directions URL', url)
        this.setState({ link : url })
    }

    render() {
        return (
            <Segment>
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

                <a className='ui button primary' href={this.state.link} target='_blank' rel="noopener noreferrer"> Get Directions</a>

            </Segment>
        );
    }
}

const mapStateToProps = state => {
    return {
        name : state.name,
        currentLocation: state.currentLocation,
        currentPlace: state.currentPlace,
        detailsShown: state.detailsShown
    }
};

export default connect(mapStateToProps)(Directions);