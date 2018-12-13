import React, { Component } from 'react';

import { Menu, Dropdown, Grid } from 'semantic-ui-react'
import querystring from 'querystring';


import helpers from '../helpers.js'

import EventsList from './events/events_list.js';
import EventsMap from './events_map.js';
import EventModal from './events/modal.js';

import Navigation from './events/navigation.js';

import '../styles/events_page.css';


class EventsPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            top_event: [],
            items: [],
            lat: 37.79535238155009,
            lon: -122.2823644705406,
            current_item: null,
            detail_shown: false,
            intervalIsSet: false
        }

        this.showDetails = this.showDetails.bind(this);
    }
     
    componentDidMount() {

        // Users geo location from HTML 5 util
        helpers.getPosition()
            .then((position) => {
                if (position) {
                    this.setState({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    });
                }
                this.showEvents();
            })
    }

    showEvents = function (position) {
        
        let query = querystring.stringify({
            lat: this.state.lat,
            lon: this.state.lon,
            distance: 2.0
        });

        console.log('Fetching this: ', '/api/events?' + query);

        fetch("/api/events?" + query)
            .then(data => data.json())
            .then(res => {
                console.log('API response: ', this.state.data)
                this.setState({ data: res.data })
            }, (error)=> {
                console.log(error)
            });
    }

    // Get the current data item and display it
    showDetails = function (id, event) {

        let current_item = this.state.data.filter(item => item._id == id);
        current_item = current_item[0];

        console.log('current_item: ', current_item)

        this.setState({ current_item: current_item, detail_shown : true });
    }

    // never let a process live forever 
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet);
            this.setState({ intervalIsSet: null });
        }
    }

    render() {

        // Don't render until the data has loaded
        if (this.state.data.length == 0) { return 'There is no data. There might be an error.' }
        
        return (
            <div>                
                <Navigation/>                
                
                {/* TODO: Move to controls form: <Dropdown placeholder='All Events' /> */}

                {/* 16 column grid */}
                <Grid>
                    <Grid.Column width={7}>
                        <EventsList data={this.state.data} onclick={this.showDetails} />
                    </Grid.Column>                    
                    <Grid.Column width={9}>
                        <EventModal data={this.state.current_item} show={this.state.detail_shown} />
                        <EventsMap data={this.state.data} lat={this.state.lat} lng={this.state.lon} />                                       
                    </Grid.Column>
                </Grid> 
            </div>
        );
    }
}

export default EventsPage;