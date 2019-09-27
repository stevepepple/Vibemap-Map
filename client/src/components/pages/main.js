import React, { Component } from 'react';
import querystring from 'querystring';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, Dimmer, Grid, Header, Icon, Loader } from 'semantic-ui-react'
import { Global, css } from '@emotion/core'
import foursquare from '../../services/foursquare.js'

// TODO: move to services
import helpers from '../../helpers.js'
import * as Constants from '../../constants.js'

// Pages
import MobilePage from './mobile.js'

import EventsList from '../events/events_list.js'
import EventDetails from '../events/event_details.js'
import EventsMap from '../events/events_map.js'
import Navigation from '../events/navigation.js'
import PlaceCards from '../places/place_cards.js'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions';

/* TODO: Break this into styles for each component */
import '../../styles/events_page.scss';
import { isNumber } from 'util';


const ApiHeaders = new Headers({
    'Authorization': 'Token ' + Constants.SYSTEM_TOKEN
});

// TODO: Seperate data rendering from layout from UI logic? 
// TODO: Move to main page component, i.e main.js or index.js
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
            event_categories: [/.*.*/, 'art', 'arts', 'comedy', 'community', 'food', 'food & drink', 'festive', 'free', 'local', 'other', 'recurs', 'music', 'urban'],
            // 'Performing Arts Venue', 'Dance Studio', 'Public Art', 'Outdoor Sculpture', 'Other Nightlife'
            // If evening include 'Nightlife Spot'
            place_categories: ['Arts & Entertainment', 'Food'],
            vibe_categories: ['adventurous', 'artsy', 'authentic', 'civic', 'chill', 'cozy', 'creative', 'energetic', 'exclusive', 'festive', 'free', 'friendly', 'healthy', 'local', 'romantic', 'interactive', 'inspired', 'vibrant', 'lively', 'crazy', 'cool', 'photogenic', 'positive', 'unique'],
            distance: 2.5,
            activity: 'all',
            current_item: null,
            details_shown: false,
            intervalIsSet: false,
            loading: true,
            timedOut: false,
            time_of_day: 'morning',
            width: window.innerWidth,
        }

        this.showDetails = this.showDetails.bind(this);
        this.clearDetails = this.clearDetails.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.handleListType = this.handleListType.bind(this);
        this.setActivity = this.setActivity.bind(this);
        this.setDays = this.setDays.bind(this);
    }
     
    componentWillMount() {

        // Handle scree resizing
        window.addEventListener('resize', this.handleWindowSizeChange);

        // TODO: remove to Redux? 
        this.setState({ activity_options : Constants.activty_categories })
        
        // Search for all categories that match the current selection and concatenate them
        // TODO: set in Redux? 
        let current = Constants.place_categories.find(item => item.key === 'all')

        this.setStateFromQuery(this.props.location.search)

        
        // Concatanate the default set of categories.
        let combined_categories = helpers.findPlaceCategoriess(current.categories);
        
        this.setState({ place_categories: combined_categories })

        // Get data for the users current location
        // TODO: Should this be a promise? 
        this.getPosition();

    }

    // Take URL params and map to state
    setStateFromQuery(query) {
        let params = querystring.parse(query)
        /*TODO: cases for each param that are validated against available options */

        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const value = params[key];
                switch (key) {
                    case "days":
                        console.log("Got days!!!!", value)
                        if (Number.isInteger(value)) {
                            this.setDays(value)
                        }
                        break;

                    case "activity":
                        // TODO: Handle validate if value is note correct
                        this.setActivity(value)
                        break;

                    default:
                        break;
                }
            }
        }
    }

    getPosition = function() {
        // Users geo location from HTML 5 util
        helpers.getPosition()
            .then((position) => {
                if (position) {
                    let location = { lat: position.coords.latitude, lon: position.coords.longitude } 

                    console.log("Set current location with: ", location)
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

    // TODO: this is replaced by Redux
    setPosition(lat, lon) {
        console.log("Setting new position!!!", lat, lon)
        this.setState({ lat : lat, lon : lon}, function(){
            this.showEvents()
            this.showPlaces()
        })
    }

    setActivity(activity, key) {

        console.log("!!!Searching for this activity: ", activity)

        let event_categories = Constants.activty_categories.find(item => item.key === activity)
        // Places have nest categories; Here's an good enough way to get those.
        // Concatanate the default set of categories.
        // Search for all categories that match the current selection and concatenate them
        let current_categories = Constants.place_categories.find(item => item.key === activity)
        let combined_categories = helpers.findPlaceCategoriess(current_categories.categories);

        this.setState({ 
            activity: activity,
            event_categories: event_categories.categories, 
            place_categories: combined_categories, 
        }, function() {
            this.showEvents()
            this.showPlaces()
        })

        
    }

    setDays(days) {
        console.log('Setting days state in main: ', days)
        this.setState({ days: days.value }, function() {
            this.showEvents()
            this.showPlaces()
        })
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth })
        console.log('window width: ', this.state.width)
    };

    //TODO Should all of this logic just flow through an event service and component?
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
            days: this.props.currentDays
        });

        this.setState({ timedOut: false})
        
        let timeout = setTimeout(() => {
            this.setState({ timedOut: true })
        }, Constants.TIMEOUT)

        fetch("/v0.1/events/?" + query, {headers: ApiHeaders})
            .then(data => data.json())
            .then(res => {
                clearTimeout(timeout);
                console.log(res);
                console.log('Received this many events: ', res.results.features.length)

                this.setState({ data: res.results.features, loading: false, timedOut : false })
            }, (error) => {
                console.log(error)
            });
    }

    showPlaces(){

        let query = querystring.stringify({
            lat: this.state.lat,
            lon: this.state.lon,
            distance: this.state.distance,
            activities: this.state.place_categories
        });

        this.setState({ timedOut: false })

        let timeout = setTimeout(() => {
            this.setState({ timedOut: true })
        }, Constants.TIMEOUT)

        fetch("/v0.1/places/?" + query, {headers: ApiHeaders})
            .then(data => data.json())
            .then(res => {
                clearTimeout(timeout);
                console.log('Received this many places: ', res.results.features.length)
                this.setState({ places_data: res.results.features, timedOut: false })
            }, (error) => {
                console.log(error)
            });

    }

    showAttractions() {
        return new Promise((resolve, reject) => {
        
        let query = 'local' //art, fun, bar, food, scenic, community
        foursquare.searchFoursquare(query, this.state.lat.toString() + ',' + this.state.lon.toString())
            .catch((err) => console.log(err))
            .then((results) => {
                
                resolve(results)
            })

            //Set State then, get top
            //.then((result) => this.setState({ result: result }))
        })
    }

    // Get the current data item and display it
    showDetails = function (id, event) {

        console.log('SHow details for: ', id)

        this.props.history.push('/v0.1/events/' + id + '/')

        let current_item = this.state.data.filter(item => item._id == id);
        current_item = current_item[0];

        let lon = current_item.geometry.coordinates[0];
        let lat = current_item.geometry.coordinates[1];

        this.setState({ current_item: current_item, details_shown : true, lat : lat, lon : lon });
    }

    handleListType = function(type) {
        console.log('Received this list type: ', type);

        if (type === 'attractions') {
            this.showAttractions();
        } else {
            
        }
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

        let navigation = <Navigation 
            setPosition={ this.setPosition } 
            updateDays={ this.setDays } 
            setActivity={ this.setActivity } 
            days={ this.props.currentDays } 
            vibes={this.state.vibe_categories} 
            activities = { this.state.event_categories } 
            activity={this.state.activity}
            isMobile = { isMobile } />

        let events_map = <EventsMap events_data={this.state.data} places_data={this.state.places_data} lat={this.state.lat} lng={this.state.lon} distance={this.state.distance} zoom={this.state.details_shown ? 16 : this.state.zoom} setPosition={this.setPosition} onclick={this.showDetails} />

        // Don't render until the data has loaded
        // TODO: Handle error versus no results versus still loading

        // Adaptive view for mobile users
        if (isMobile) {
            return (                
                <MobilePage data={this.state.data} places_data={this.state.places_data} lat={this.state.lat} lon={this.state.lon} days={this.state.days} distance={this.state.distance} vibe_categories={this.state.vibe_categories} details_shown={this.state.details_shown} isMobile={isMobile} />
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
                                    this.state.details_shown ? (
                                        <EventDetails data={this.state.current_item} clearDetails={this.clearDetails} />
                                    ) : (
                                        <EventsList data={this.state.data} type='places' onclick={this.showDetails} handleListType={this.handleListType} />
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
                                        // TODO: The are more generally recommendations
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
    currentCategory: state.currentCategory,
    currentLocation: state.currentLocation,
    currentZoom: state.currentZoom,
    currentDays: state.currentDays,
    currentDistance: state.currentDistance
});

const EventsPage = connect(
    mapStateToProps,
    // Or actions
    actions
)(Page);

export default EventsPage;