import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Menu, Dropdown } from 'semantic-ui-react'
import querystring from 'querystring';


import helpers from '../helpers.js'

import EventCard from './event_card.js'
import EventsList from './events_list.js';
import EventsMap from './events_map.js';

import '../styles/events_page.css';


class EventsPage extends Component {

    state = {
        data: [],
        items: [],
        lat: 37.79535238155009,
        lon: -122.2823644705406,
        intervalIsSet: false
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
            .catch(err => console.error(err))
            .then(data => data.json())
            .then(res => {
                console.log('API response: ', this.state.data)
                this.setState({ data: res.data })
            
            });
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
        
        return (
            <div>                

                <h2>Happening Near You</h2>
                
                {/* <Dropdown placeholder='All Events' /> */}
                
                <Tabs selectedTabClassName='active'>
                    <TabList className='ui menu secondary'>
                        <Tab className='item'>List</Tab>
                        <Tab className='item'>Map</Tab>
                    </TabList>

                    <TabPanel>
                        <EventsList data={this.state.data} />
                    </TabPanel>
                    <TabPanel>
                        <EventsMap data={this.state.data} lat={this.state.lat} lng={this.state.lon} />
                    </TabPanel>
                </Tabs>
                
            </div>
 
        );
    }
}

export default EventsPage;