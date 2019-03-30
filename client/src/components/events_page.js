import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Button, Dimmer, Grid, Icon, Loader } from 'semantic-ui-react'
import querystring from 'querystring';

import helpers from '../helpers.js'
import * as Constants from '../constants.js'

import EventsList from './events/events_list.js';
import EventsCards from './events/events_cards.js';
import EventDetails from './events/event_details.js';
import EventsMap from './events/events_map.js';
import EventModal from './events/modal.js';
import Navigation from './events/navigation.js';
import PlaceCards from './places/place_cards.js';

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../redux/actions';

import '../styles/events_page.css';

class Page extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            top_event: [],
            items: [],
            lat: 37.79535238155009,
            lon: -122.2823644705406,
            days: 3,
            distance: 2.5,
            current_item: null,
            details_shown: false,
            intervalIsSet: false,
            timedOut: false,
            name: 'Steve',
            width: window.innerWidth,
        }

        this.showDetails = this.showDetails.bind(this);
        this.clearDetails = this.clearDetails.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setDistance = this.setDistance.bind(this);
        this.setDays = this.setDays.bind(this);
    }
     
    componentWillMount() {

        this.getPosition();
        
        // Handle scree resizing
        window.addEventListener('resize', this.handleWindowSizeChange);

        this.props.setName('Amanda')

    }

    getPosition = function() {
        // Users geo location from HTML 5 util
        helpers.getPosition()
            .then((position) => {
                if (position) {
                    let location = { lat: position.coords.latitude, lon: position.coords.longitude } 
                    this.props.setCurrentLocation(location)
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

        this.showEvents()
    }

    setDistance(distance) {
        this.setState({ distance : distance })
    }

    setDays(days) {
        this.setState({ days: days.value })
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
            distance: this.state.distance,
            days: this.state.days
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

        console.log('SHow details for: ', id)

        this.props.history.push('/events/?id=' + id )

        let current_item = this.state.data.filter(item => item._id == id);
        current_item = current_item[0];

        let lon = current_item.geometry.coordinates[0];
        let lat = current_item.geometry.coordinates[1];

        this.setState({ current_item: current_item, details_shown : true, lat : lat, lon : lon });
    }

    clearDetails = function() {
        this.props.history.replace('/events/')

        this.setState({ current_item : null, details_shown : false })
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
                    <Navigation setPosition={this.setPosition} setDays={this.setDays} days={this.state.days} setDistance={this.setDistance} isMobile={isMobile} />

                    <Tabs selectedTabClassName='active'>
                        <TabList className='ui menu secondary'>
                            <Tab className='item'><Icon name='list ul' />List</Tab>
                            <Tab className='item'>Map</Tab>
                        </TabList>

                        <TabPanel>
                            <EventsCards data={this.state.data} onclick={this.showDetails} />
                            {/* <EventModal data={this.state.current_item} show={this.state.detail_shown} details={<EventDetails data={this.state.current_item_item} />} /> */}
                        </TabPanel>
                        <TabPanel>
                            <EventsMap data={this.state.data} lat={this.state.lat} lng={this.state.lon} zoom={this.state.details_shown ? 15 : 13} />
                        </TabPanel>
                    </Tabs>
                </div>
            )
        } else {
            return (
                <div>
                    <Navigation setPosition={this.setPosition} setDays={this.setDays} days={this.state.days} />

                    {/* 16 column grid */}
                    <Grid>
                        <Grid.Row stretched className='collapsed'>
                            <Grid.Column width={7} className='list_details'>
                                {
                                    /* TODO: Refactor into component */
                                    this.state.details_shown? (
                                        <EventDetails data={this.state.current_item} clearDetails={this.clearDetails} />
                                     ) : (
                                        <EventsList data={this.state.data} onclick={this.showDetails} />
                                    )
                                }
                                    
                                {/* <EventsList data={this.state.data} onclick={this.showDetails} /> */}
                            </Grid.Column>
                            <Grid.Column width={9}>
                                {/* <EventModal data={this.state.current_item} show={false} details={<EventDetails data={this.state.current_item_item}/>} /> */}
                                <EventsMap data={this.state.data} lat={this.state.lat} lng={this.state.lon} zoom={this.state.details_shown ? 15 : 13} setPosition={this.setPosition} onclick={this.showDetails} />
                                {
                                    /* TODO: Refactor into component */
                                    this.state.details_shown ? (
                                        <PlaceCards lat={this.state.lat} lon={this.state.lon} />
                                    ) : (
                                        null
                                    )
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            );
        }
    }
}

// AppContainer.js
const mapStateToProps = state => ({
    geod: state.geod,
    currentLocation: state.currentLocation,
    name: state.name
});

const EventsPage = connect(
    mapStateToProps,
    // Or actions
    actions
)(Page);

export default EventsPage;