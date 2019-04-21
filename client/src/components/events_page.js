import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Button, Dimmer, Grid, Header, Icon, Loader } from 'semantic-ui-react'
import querystring from 'querystring';
import moment from 'moment';

import helpers from '../helpers.js'
import * as Constants from '../constants.js'

import EventsList from './events/events_list.js'
import EventsCards from './events/events_cards.js'
import EventDetails from './events/event_details.js'
import EventsMap from './events/events_map.js'
import EventModal from './events/modal.js'
import Navigation from './events/navigation.js'
import PlaceCards from './places/place_cards.js'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../redux/actions';

import '../styles/events_page.css';

class Page extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            places_data: [],
            top_event: [],
            items: [],
            lat: 37.79535238155009,
            lon: -122.2823644705406,
            days: 3,
            event_categories: [/.*.*/, 'art', 'arts', 'comedy', 'community', 'food', 'food & drink', 'festive', 'free', 'local', 'other', 'recurs', 'music', 'urban'],
            // 'Performing Arts Venue', 'Dance Studio', 'Public Art', 'Outdoor Sculpture', 'Other Nightlife'
            // If evening include 'Nightlife Spot'
            place_categories: ['Arts & Entertainment', 'Food'],
            vibe_categoreis: ['adventurous', 'authentic', 'civic', 'creative', 'comedy', 'fun', 'chill', 'cozy', 'energetic', 'exclusive', 'festive', 'free', 'friendly', 'healthy', 'romantic', 'interactive', 'inspired', 'vibrant', 'lively', 'crazy', 'cool', 'photogenic', 'positive', 'unique'],
            distance: 2.2,
            current_item: null,
            details_shown: false,
            intervalIsSet: false,
            loading: true,
            timedOut: false,
            name: 'Steve',
            time_of_day: 'morning',
            width: window.innerWidth,
            zoom: 13
        }

        this.showDetails = this.showDetails.bind(this);
        this.clearDetails = this.clearDetails.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.setZoom = this.setZoom.bind(this);
        this.setDistance = this.setDistance.bind(this);
        this.setActivity = this.setActivity.bind(this);
        this.setDays = this.setDays.bind(this);
    }
     
    componentWillMount() {

        this.getPosition();

        let time_of_day = helpers.getTimeOfDay(moment());

        // Handle scree resizing
        window.addEventListener('resize', this.handleWindowSizeChange);

        // TODO: remove to Redux? 
        this.setState({ activity_options : Constants.activty_categories, time_of_day : time_of_day })

        // Concatanate the default set of categories.
        // Search for all categories that match the current selection and concatenate them
        let current = Constants.place_categories.find(item => item.key === 'all')
        let combined_categories = helpers.findPlaceCategoriess(current.categories);
        
        this.setState({ place_categories: combined_categories })
                
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
                this.showEvents()
                this.showPlaces()
            })
    }

    setPosition(lat, lon) {
        this.setState({ lat : lat, lon : lon}, function(){
            this.showEvents()
            this.showPlaces()
        })
    }

    setZoom(zoom){
        this.setState({ zoom: zoom })
    }

    setDistance(distance) {
        this.setState({ distance : distance })
    }

    setActivity(activity, key) {

        let event_categories = Constants.activty_categories.find(item => item.key === activity.value)

        console.log("Searching for these events: ", event_categories)

        // Places have nest categories; Here's an good enough way to get those.

        // Concatanate the default set of categories.
        // Search for all categories that match the current selection and concatenate them
        let current_categories = Constants.place_categories.find(item => item.key === activity.value)
        let combined_categories = helpers.findPlaceCategoriess(current_categories.categories);

        this.setState({ event_categories: event_categories.categories, place_categories: combined_categories }, function() {

            this.showEvents()
            this.showPlaces()
        })
    }

    setDays(days) {
        this.setState({ days: days.value }, function() {
            this.showEvents()
            this.showPlaces()
        })
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth })
        console.log('window width: ', this.state.width)
    };

    showEvents(position) {

        this.state.data.pop()
        /*
        this.setState({ data : this.state.data })
        */
        let query = querystring.stringify({
            lat: this.state.lat,
            lon: this.state.lon,
            distance: this.state.distance,
            activity: this.state.event_categories,
            days: this.state.days
        });

        this.setState({ timedOut: false})
        
        let timeout = setTimeout(() => {
            this.setState({ timedOut: true })
        }, Constants.TIMEOUT)

        fetch("/api/events?" + query)
            .then(data => data.json())
            .then(res => {
                clearTimeout(timeout);
                console.log('Received this many events: ', res.data.length)

                this.setState({ data: res.data, loading: false, timedOut : false })
            }, (error) => {
                console.log(error)
            });
    }

    showPlaces(){

        let query = querystring.stringify({
            lat: this.state.lat,
            lon: this.state.lon,
            distance: this.state.distance,
            activity: this.state.place_categories
        });

        this.setState({ timedOut: false })

        let timeout = setTimeout(() => {
            this.setState({ timedOut: true })
        }, Constants.TIMEOUT)

        fetch("/api/places?" + query)
            .then(data => data.json())
            .then(res => {
                clearTimeout(timeout);
                console.log('Received this many places: ', res.data.length)
                this.setState({ places_data: res.data, timedOut: false })
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

        let navigation = <Navigation setPosition={ this.setPosition } setZoom={ this.setZoom } setDays={ this.setDays } setActivity={ this.setActivity } days={ this.state.days } vibes={this.state.vibe_categoreis} activity = { this.state.event_categories } setDistance = { this.setDistance } isMobile = { isMobile } />
        let events_map = <EventsMap events_data={this.state.data} places_data={this.state.places_data} setZoom={this.setZoom} lat={this.state.lat} lng={this.state.lon} distance={this.state.distance} zoom={this.state.details_shown ? 16 : this.state.zoom} setPosition={this.setPosition} onclick={this.showDetails} />

        // Don't render until the data has loaded
        // TODO: Handle error versus no results versus still loading

        // Adaptive view for mobile users
        if (isMobile) {
            return (
                <div>
                    
                    {navigation}                

                    <Tabs selectedTabClassName='active'>
                        
                        <TabList className='ui menu secondary'>
                            <Tab className='item'><Icon name='list ul' />List</Tab>
                            <Tab className='item'>Map</Tab>
                        </TabList>

                        <TabPanel>
                            if (this.state.data.length == 0) {
                                <div>No results</div>
                            }

                            <EventsCards data={this.state.data} onclick={this.showDetails} />
                            {/* <EventModal data={this.state.current_item} show={this.state.detail_shown} details={<EventDetails data={this.state.current_item_item} />} /> */}
                        </TabPanel>
                        <TabPanel>
                            {events_map}
                        </TabPanel>
                    </Tabs>
                </div>
            )
        } else {
            return (
                <div>
                    {navigation}

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

                                {events_map}

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