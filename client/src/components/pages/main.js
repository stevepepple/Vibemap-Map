import React, { Component } from 'react'

import querystring from 'querystring'
import isEqual from 'react-fast-compare'

import { Grid } from 'semantic-ui-react'
//TODO: Move to API
import foursquare from '../../services/foursquare.js'
import VibeMap from '../../services/VibeMap.js'

// TODO: move to services
import helpers from '../../helpers.js'
import * as Constants from '../../constants.js'

// Pages
import MobilePage from './mobile.js'
import EventsList from '../events/events_list.js'
import EventDetails from '../events/event_details.js'
import EventsMap from '../events/events_map.js'
import Navigation from '../events/navigation.js'
//import PlaceCards from '../places/place_cards.js'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

/* TODO: Break this into styles for each component */
import '../../styles/events_page.scss'

// TODO: Seperate data rendering from layout from UI logic? 
// TODO: Move to main page component, i.e main.js or index.js
class Page extends Component {

    constructor(props) {
        super(props)

        this.state = {
            top_event: [],
            items: [],
            // TODO: set state form YAML
            event_categories: [/.*.*/, 'art', 'arts', 'comedy', 'community', 'food', 'food & drink', 'festive', 'free', 'local', 'other', 'recurs', 'music', 'urban'],
            // 'Performing Arts Venue', 'Dance Studio', 'Public Art', 'Outdoor Sculpture', 'Other Nightlife'
            // If evening include 'Nightlife Spot'
            place_categories: ['Arts & Entertainment', 'Food'],
            vibe_categories: ['adventurous', 'artsy', 'authentic', 'civic', 'chill', 'cozy', 'creative', 'energetic', 'exclusive', 'festive', 'free', 'friendly', 'healthy', 'local', 'romantic', 'interactive', 'inspired', 'vibrant', 'lively', 'crazy', 'cool', 'photogenic', 'positive', 'unique'],
            // TODO: handle conversion math in VibeMap
            current_item: null,
            details_shown: false,
            intervalIsSet: false,
            loading: true,
            timedOut: false,
            time_of_day: 'morning',
            width: window.innerWidth,
        }

        // THIS is an optimization to instantiate these func just once
        this.setStateFromQuery = this.setStateFromQuery.bind(this)
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
        this.fetchEvents = this.fetchEvents.bind(this)
        this.fetchPlaces = this.fetchPlaces.bind(this)
        // TODO: move to Redux and pull default activities from YAML
        this.setActivity = this.setActivity.bind(this)
        // TODO: move to Redux
        this.clearDetails = this.clearDetails.bind(this)
    }
     
    componentWillMount() {
        
        console.log("Mounting main page...")
        // TODO: remove to Redux? 
        this.setState({ activity_options : Constants.activty_categories })
        
        // Search for all categories that match the current selection and concatenate them
        // TODO: set in Redux? 
        let current = Constants.place_categories.find(item => item.key === 'all')
        
        // Concatanate the default set of categories
        let combined_categories = helpers.findPlaceCategoriess(current.categories)

        this.setStateFromQuery(this.props.location.search)
        this.setState({ place_categories: combined_categories })

    }

    componentDidMount() {
        
        // Set global state with user's location
        helpers.getPosition()
            .then((position) => {
                if (position) {
                    this.props.setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                } else {
                    // TODO: what if the user disallows location
                }
        })

        // Handle scree resizing
        window.addEventListener('resize', this.handleWindowSizeChange)
    }

    componentDidUpdate(prevProps, prevState) {
    
        // TODO: should be a switch statement
        if (prevProps.searchTerm !== this.props.searchTerm) {
            this.fetchEvents()
        }

        if (!isEqual(prevProps.currentLocation, this.props.currentLocation)) {
            this.fetchEvents()
            this.fetchPlaces()
            this.fetchCities()
        }
        
        if (!isEqual(prevProps.currentZoom, this.props.currentZoom)) {
            this.fetchEvents()
            this.fetchPlaces()
            this.fetchCities()
        }
    }

    // never let a process live forever 
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet)
            this.setState({ intervalIsSet: null })
        }
    }

    // Take URL params and map to state
    // TODO: Sync the URL state both ways
    setStateFromQuery(query) {
        let params = querystring.parse(query)
        /*TODO: cases for each param that are validated against available options */

        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const value = params[key]
                switch (key) {
                    case "days":
                        console.log("Got days!!!!", value)
                        if (Number.isInteger(value)) {
                            this.props.setDays(value)
                        }
                        break

                    case "activity":
                        // TODO: Handle validate if value is note correct
                        this.setActivity(value)
                        break

                    default:
                        break
                }
            }
        }
    }

    // TODO: set via Redux
    // TODO: Or load from YAML definition
    setActivity(activity, key) {

        let event_categories = Constants.activty_categories.find(item => item.key === activity)
        // Places have nest categories; Here's an good enough way to get those.
        // Concatanate the default set of categories.
        // Search for all categories that match the current selection and concatenate them
        let current_categories = Constants.place_categories.find(item => item.key === activity)
        let combined_categories = helpers.findPlaceCategoriess(current_categories.categories)

        this.setState({ 
            activity: activity,
            event_categories: event_categories.categories, 
            place_categories: combined_categories, 
        }, function() {
            this.fetchEvents()
            this.fetchPlaces()
        })
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth })
    }

    fetchCities() {
        VibeMap.getCities()
            .then(results => {
                console.log("Got city boundary data: ", results.data)
                this.props.setCities(results.data)
            })
    }

    /* TODO: Should all of this logic just flow through an event service and component? */
    // Change to getPlaces
    fetchEvents(position) {

        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`
        this.setState({ timedOut: false})    
    
        /* Get current events, then set them in the state */
        /* TODO: package args into spread object? */
        
        VibeMap.getEvents(point, this.props.currentDistance, this.state.event_categories, this.props.currentDays, this.props.searchTerm)
            .then(results => {
                this.props.setEventsData(results.data)
                this.setState({ loading: false, timedOut: false })
            }, (error) => {
                console.log(error)
            })
    }

    // Get Ranked Places for the map
    // TODO: Move to service & reducer
    fetchPlaces(){

        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`

        this.setState({ timedOut: false })

        /* Get nearby places, then set them in the Redux state */
        /* TODO: package args into spread object? */
        console.log("Getting places for current distance: ", this.props.currentDistance)
        VibeMap.getPlaces(point, this.props.currentDistance, this.state.event_categories, this.props.currentVibes)
            .then(results => {
                this.props.setPlacesData(results.data)
                this.setState({ loading: false, timedOut: false })
            }, (error) => {
                console.log(error)
            })
    }

    clearDetails = function() {
        this.props.history.replace('')

        this.props.setDetailsId(null)
        this.props.setDetailsShown(false)
    }

    render() {

        const { width } = this.state
        const isMobile = width <= 700

        // TODO: best practice is to make this a func? 
        let navigation = <Navigation 
            setActivity={ this.setActivity } 
            days={ this.props.currentDays } 
            vibes={this.state.vibe_categories} 
            activities = { this.state.event_categories } 
            activity={this.state.activity}
            isMobile = { isMobile } />

        let events_map = <EventsMap searchTerm={this.props.searchTerm} events_data={this.props.eventsData} places_data={this.props.placesData} zoom={this.props.detailsShown ? 16 : this.props.currentZoom} setPosition={this.setPosition} />

        // Don't render until the data has loaded
        // TODO: Handle error versus no results versus still loading

        // Adaptive view for mobile users
        if (isMobile) {
            return (                
                <MobilePage data={this.props.eventsData} onclick={this.showDetails} places_data={this.props.placesData} vibe_categories={this.state.vibe_categories} details_shown={this.state.details_shown} isMobile={isMobile} />
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
                                    this.props.detailsShown ? (
                                        <EventDetails id={this.props.detailsId} clearDetails={this.clearDetails} />
                                    ) : (
                                        <EventsList data={this.props.eventsData} type='places' onclick={this.showDetails} />
                                    )
                                }

                                {/* <EventsList data={this.state.data} onclick={this.showDetails} /> */}
                                
                            </Grid.Column>
                            <Grid.Column width={9}>
                                {/* <EventModal data={this.state.current_item} show={false} details={<EventDetails data={this.state.current_item_item}/>} /> */}

                                {events_map}

                                {/* TODO: Refactor into component 
                                    this.state.details_shown ? (
                                        // TODO: The are more generally recommendations
                                        <PlaceCards lat={this.state.lat} lon={this.state.lon} />
                                    ) : (
                                        null
                                    )
                                */}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            )
        }
    }
}

const mapStateToProps = state => ({
    cities: state.cities,
    geod: state.geod,
    currentCategory: state.currentCategory,
    currentLocation: state.currentLocation,
    currentZoom: state.currentZoom,
    currentDays: state.currentDays,
    currentDistance: state.currentDistance,
    currentVibes: state.currentVibes,
    detailsShown: state.detailsShown,
    detailsId: state.detailsId,
    eventsData: state.eventsData,
    placesData: state.placesData,
    searchTerm: state.searchTerm
})

const EventsPage = connect(
    mapStateToProps,
    // Or actions
    actions
)(Page)

export default EventsPage
