import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Button, Dimmer, Grid, Loader } from 'semantic-ui-react'
import querystring from 'querystring';

import helpers from '../helpers.js'
import * as Constants from '../constants.js'

import EventsList from './events/events_list.js';
import EventsCards from './events/events_cards.js';
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
            intervalIsSet: false,
            timedOut: false,
            width: window.innerWidth,
        }

        this.showDetails = this.showDetails.bind(this);
        this.setPosition = this.setPosition.bind(this);

    }
     
    componentWillMount() {

        this.getPosition();
        
        // Handle scree resizing
        window.addEventListener('resize', this.handleWindowSizeChange);

    }

    getPosition = function() {
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

    setPosition(lat, lon) {
        this.setState({ lat : lat, lon : lon})

        console.log('UPdated Position: ', this.state)
        this.showEvents()
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth });
        console.log('window width: ', this.state.width)

    };

    showEvents(position) {

        this.state.data.pop()
        this.setState({ data : this.state.data })
        
        let query = querystring.stringify({
            lat: this.state.lat,
            lon: this.state.lon,
            distance: 2.0
        });

        this.setState({ timedOut: false})
        
        let timeout = setTimeout(() => {
            this.setState({ timedOut: true })
        }, Constants.TIMEOUT)

        console.log('Fetching this: ', '/api/events?' + query);
        fetch("/api/events?" + query)
            .then(data => data.json())
            .then(res => {
                console.log('API response: ', this.state.data)
                clearTimeout(timeout);
                this.setState({ data: res.data, timedOut : false })
            }, (error) => {
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

    restart() {
        
        this.setState({ data : [] })
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

        const { width } = this.state;
        const isMobile = width <= 700;

        // Don't render until the data has loaded
        // TODO: Handle error versus no results
        if (this.state.data.length == 0) {
            if (this.state.timedOut) {
                return (
                <div className='empty_state'>
                    <p>No data. There might be an error.</p>
                        <Button secondary onClick={() => { window.location.reload() }}>Reload</Button>
                </div>)             
            } else {
                return (
                    <div className='empty_state'>
                        <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
                    </div>
                )
            }
 
        }

        // Adaptive view for mobile users
        if (isMobile) {
            return (
                <div>
                    <Navigation setPosition={this.setPosition} />

                    <Tabs selectedTabClassName='active'>
                        <TabList className='ui menu secondary'>
                            <Tab className='item'>List</Tab>
                            <Tab className='item'>Map</Tab>
                        </TabList>

                        <TabPanel>
                            <EventsCards data={this.state.data} />
                        </TabPanel>
                        <TabPanel>
                            <EventsMap data={this.state.data} lat={this.state.lat} lng={this.state.lon} />
                        </TabPanel>
                    </Tabs>
                </div>
            )
        } else {
            return (
                <div>
                    <Navigation setPosition={this.setPosition} />

                    {/* 16 column grid */}
                    <Grid>
                        <Grid.Column width={7}>
                            <EventsList data={this.state.data} onclick={this.showDetails} />
                        </Grid.Column>
                        <Grid.Column width={9}>
                            <EventModal data={this.state.current_item} show={this.state.detail_shown} />
                            <EventsMap data={this.state.data} lat={this.state.lat} lng={this.state.lon} setPosition={this.setPosition} />
                        </Grid.Column>
                    </Grid>
                </div>
            );
        }
    }
}

export default EventsPage;