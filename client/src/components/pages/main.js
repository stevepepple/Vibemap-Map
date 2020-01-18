import React, { Component } from 'react'

import queryString from 'querystring'
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

import PlaceDetails from '../places/places_details.js'
import PlacesList from '../places/places_list.js'
import ErrorBoundary from '../pages/GlobalError.js'

import EventsMap from '../events/events_map.js'
import Navigation from '../events/navigation.js'
//import PlaceCards from '../places/place_cards.js'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import { store } from '../../redux/store'
import { push } from 'connected-react-router'

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
            vibe_categories: ['adventurous', 'artsy', 'authentic', 'civic', 'chill', 'cozy', 'creative', 'energetic', 'exclusive', 'festive', 'free', 'friendly', 'healthy', 'local', 'romantic', 'interactive', 'inspired', 'vibrant', 'lively', 'outdoors', 'scenic', 'positive', 'unique'],
            // TODO: handle conversion math in VibeMap
            current_item: null,
            details_shown: false,
            intervalIsSet: false,
            loading: true,
            timedOut: false,
            time_of_day: 'morning',
            top_picks: [],
            width: window.innerWidth,
        }

        // THIS is an optimization to instantiate these func just once
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
        this.fetchEvents = this.fetchEvents.bind(this)
        this.fetchPlaces = this.fetchPlaces.bind(this)
        // TODO: move to Redux and pull default activities from YAML
        this.setActivity = this.setActivity.bind(this)
        // TODO: move to Redux
        this.clearDetails = this.clearDetails.bind(this)
    }
     
    componentWillMount() {
        
        // TODO: remove to Redux? 
        this.setState({ activity_options : Constants.activty_categories })
        
        // Search for all categories that match the current selection and concatenate them
        // TODO: set in Redux? 
        let current = Constants.place_categories.find(item => item.key === 'all')
        
        // Concatanate the default set of categories
        let combined_categories = helpers.findPlaceCategoriess(current.categories)

        this.setState({ place_categories: combined_categories })
    }

    componentDidMount() {
        
        // Set global state with user's location
        let params = queryString.parse(this.props.search)

        // TODO: There should be a button for "Near Me"
        if (params.latitude && params.longitude) {
            this.props.setCurrentLocation({ latitude: params.latitude, longitude: params.longitude })
        } else {
            helpers.getPosition()
                .then((position) => {
                    if (position) {
                        this.props.setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                    } else {
                        // TODO: what if the user disallows location
                    }
                })
        }
        
        // Handle scree resizing
        window.addEventListener('resize', this.handleWindowSizeChange)
    }

    componentDidUpdate(prevProps, prevState) {
    
        // TODO: should be a switch statement
        if (prevProps.searchTerm !== this.props.searchTerm) {
            //this.fetchEvents()
            this.fetchPlaces(true)
        }

        if (!isEqual(prevProps.currentVibes, this.props.currentVibes)) {
            //this.fetchEvents()
            this.fetchPlaces(true)
        }

        //console.log("Search for: ", this.props.searchTerm)
        if (!isEqual(prevProps.searchTerm, this.props.searchTerm) && this.props.searchTerm > 2) {
            this.fetchPlaces(true)
        }

        if (!isEqual(prevProps.activity, this.props.activity)) {
            //this.fetchEvents()
            this.fetchPlaces()
        }

        //console.log("Search for: ", this.props.searchTerm)
        if (!isEqual(prevProps.searchTerm, this.props.searchTerm) && this.props.searchTerm > 2) {
            this.fetchPlaces()
        }

        if (!isEqual(prevProps.currentLocation, this.props.currentLocation)) {
            // TODO: measure distance between current and previous event
            // If they close together, merge the data in fetchPlaces.
            //this.fetchEvents()
            this.fetchPlaces(true)
            this.fetchCities()
            //this.fetchNeighborhoods()
        }
        
        if (!isEqual(prevProps.zoom, this.props.zoom)) {
        
            this.props.setDistance(helpers.zoomToRadius(this.props.zoom))
            this.fetchPlaces(false)
            //this.fetchEvents()
            //this.fetchNeighborhoods()
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

    setLocationParams = location => {
        // Slice remove the question mark
        let params = queryString.parse(this.props.search.slice(1))

        params["latitude"] = location.latitude
        params["longitude"] = location.longitude
        
        let string = queryString.stringify(params)
        store.dispatch(push({ search: string }))
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
            this.fetchPlaces()
            //this.fetchEvents()
            //this.fetchNeighborhoods()
        })
    }

    handleWindowSizeChange = () => {
        this.setState({ width: window.innerWidth })
    }

    fetchCities() {
        VibeMap.getCities()
            .then(results => {
                this.props.setCities(results.data)
            })
    }

    fetchNeighborhoods() {
        VibeMap.getNeighborhoods()
            .then(results => {
                this.props.setNeighborhoods(results.data)
            })
    }

    fetchHeamap() {
        VibeMap.getHeatMap()
            .then(results => {
                //this.props.setNeighborhoods(results.data)
            })
    }

    /* TODO: Should all of this logic just flow through an event service and component? */
    // Change to getPlaces
    fetchEvents(position) {

        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`
        if(this.state.timedOut == true) {
            this.setState({ timedOut: false })
        }
    
        /* Get current events, then set them in the state */
        /* TODO: package args into spread object? */
        
        VibeMap.getEvents(point, this.props.distance, this.state.event_categories, this.props.currentDays, this.props.searchTerm)
            .then(results => {
                this.props.setEventsData(results.data)
                this.setState({ loading: false, timedOut: false })
            }, (error) => {
                console.log(error)
            })
    }

    // Get Ranked Places for the map
    // TODO: Move to service & reducer
    fetchPlaces(refreshResults){

        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`

        if (this.state.timedOut == true) this.setState({ timedOut: false, searching: false })

        /* Get nearby places, then set them in the Redux state */
        // If there a search term or vibes do a top pick search
        if (this.props.currentVibes.length > 0 || this.props.searchTerm !== "") {
            this.setState({ searching: true})
            
            // TODO: add search variable.
            VibeMap.getPicks(point, this.props.distance, this.props.activity, this.props.currentVibes, this.props.searchTerm)
                .then(results => {
                    //this.props.setPlacesData(results.data)
                    // TODO: any reason to store this in redux
                    //this.setState({ top_picks: results.data })
                    let top_picks = results.data.slice(1, 12)
                    console.log('top_picks: ', top_picks)
                    this.props.setTopPicks(top_picks)
            }, (error) => {
                console.log(error)
            })
        } else {
            this.setState({ searching: false }) 
        }

        VibeMap.getPlaces(point, this.props.distance, this.props.activity, this.props.currentDays, this.props.currentVibes, this.props.searchTerm)
            .then(results => {
                this.props.setPlacesData(results.data, refreshResults)

                if(this.state.searching !== true) {
                    // TODO: still join to results?
                    // This won't be needed if top picks work, right? 
                    let top_picks = this.props.placesData.slice(1, 12)
                    this.props.setTopPicks(top_picks)
                    //this.setState({ top_picks: })
                }
                
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

        let events_map = <EventsMap searchTerm={this.props.searchTerm} events_data={this.props.eventsData} places_data={this.props.placesData} zoom={this.props.detailsShown ? 16 : this.props.zoom} setPosition={this.setPosition} setLocationParams={this.setLocationParams} />

        // Don't render until the data has loaded
        // TODO: Handle error versus no results versus still loading

        // Adaptive view for mobile users
        if (isMobile) {
            return (                
                <MobilePage data={this.props.eventsData} onclick={this.showDetails} places_data={this.props.placesData} vibe_categories={this.state.vibe_categories} details_shown={this.state.details_shown} isMobile={isMobile} />
            )
        } else {
            return (
                <React.Fragment>
                    {navigation}

                    {/* 16 column grid */}
                    <Grid className='content'>
                        <Grid.Row stretched className='collapsed'>
                            <Grid.Column floated='left' width={5} className='list_details'>
                                {
                                    /* TODO: Refactor into component */
                                    this.props.detailsShown ? (
                                        <PlaceDetails id={this.props.detailsId} clearDetails={this.clearDetails} />
                                    ) : (
                                        <PlacesList data={this.props.placesData} type='places' onclick={this.showDetails} />
                                    )
                                }

                                {/* <EventsList data={this.state.data} onclick={this.showDetails} /> */}
                                
                            </Grid.Column>
                            <Grid.Column width={11}>
                                
                                <ErrorBoundary>

                                    {events_map}

                                </ErrorBoundary>

                                {/* <EventModal data={this.state.current_item} show={false} details={<EventDetails data={this.state.current_item_item}/>} /> */}

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
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = state => ({
    activity: state.activity,
    cities: state.cities,
    geod: state.geod,
    currentCategory: state.currentCategory,
    currentLocation: state.currentLocation,
    zoom: state.zoom,
    currentDays: state.currentDays,
    currentVibes: state.currentVibes,
    detailsShown: state.detailsShown,
    detailsId: state.detailsId,
    distance: state.distance,
    eventsData: state.eventsData,
    placesData: state.placesData,
    searchTerm: state.searchTerm,
    search: state.router.location.search,
    topPicks: state.topPicks
})

const EventsPage = connect(
    mapStateToProps,
    // Or actions
    actions
)(Page)

export default EventsPage
