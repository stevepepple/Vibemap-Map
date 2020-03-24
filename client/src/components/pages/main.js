import React, { Component } from 'react'

import queryString from 'querystring'
import isEqual from 'react-fast-compare'

import { Grid } from 'semantic-ui-react'
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
// THIS is a high-order component so styles should go elsewhere
import '../../styles/vibe_generator.scss'

// TODO: Seperate data rendering from layout from UI logic? 
// TODO: Move to main page component, i.e main.js or index.js
class Page extends Component {

    constructor(props) {
        super(props)

        // State includes some globals only for the main page; 
        // Most other UI state is managed by Redux
        this.state = {
            clusterSize: 80,
            top_event: [],
            items: [],
            // TODO: set state form YAML
            event_categories: [/.*.*/, 'art', 'arts', 'comedy', 'community', 'food', 'food & drink', 'festive', 'free', 'local', 'other', 'recurs', 'music', 'urban'],
            // 'Performing Arts Venue', 'Dance Studio', 'Public Art', 'Outdoor Sculpture', 'Other Nightlife'
            // If evening include 'Nightlife Spot'
            place_categories: ['Arts & Entertainment', 'Food'],
            vibe_categories: ['adventurous', 'artsy', 'atmosphere', 'authentic', 'bold', 'civic', 'chill', 'classic', 'cool', 'comfortable', 'cowork', 'cozy', 'creative', 'dance', 'dive', 'diverse', 'energetic', 'exclusive', 'family', 'festive', 'free', 'friendly', 'fun', 'gay', 'healthy', 'hidden', 'historic', 'interactive', 'inspired', 'intimate', 'local', 'lively', 'magical', 'new', 'oldschool', 'outdoors', 'peaceful', 'playful', 'popular', 'positive', 'public', 'romantic', 'queer', 'quiet', 'raunchy', 'retro', 'scenic', 'soul', 'sweet', 'transformative', 'trending', 'vibrant', 'unique', 'wild', 'women-owned', 'zen'],
            // TODO: handle conversion math in VibeMap
            intervalIsSet: false,
            loading: true,
            num_top_picks: 12,
            timedOut: false,
            mergeTopPicks: false,
            time_of_day: 'morning',
            // Used for mobile adaptive layout
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
                
        // Search for all categories that match the current selection and concatenate them
        // TODO: set in Redux? 
        let current = Constants.place_categories.find(item => item.key === 'any')
        
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

        // TODO: One-time recommended nearby search if the user has selected a place.

        // TODO: should be a switch statement        
        let updateData = false
        let refreshResults = false                     
        //let distanceChanged = false

        // TODO: Move this to actions or service layer as shouldFetchData        
        if (!isEqual(prevProps.currentVibes, this.props.currentVibes)) {        
            updateData = true
            refreshResults = true
        }

        if (!isEqual(prevProps.searchTerm, this.props.searchTerm) && this.props.searchTerm > 2) {
            updateData = true
            refreshResults = true
        }

        if (!isEqual(prevProps.activity, this.props.activity)) {
            updateData = true
            refreshResults = true
        }

        if (!isEqual(prevProps.placeType, this.props.placeType)) {
            updateData = true
            refreshResults = true
        }
        
        if (!isEqual(prevProps.currentLocation.latitude, this.props.currentLocation.latitude)) {
            // TODO: measure distance between current and previous event
            // If they close together, merge the data in fetchPlaces.
            updateData = true
            // TODO: Only refesh if the map moved by a significant jump...
            refreshResults = true    
        }

        if (!isEqual(prevProps.zoom, this.props.zoom)) {
            updateData = true
            // Only refresh if it a whole step up or down            
            let zoom_diff = this.props.zoom - prevProps.zoom
            if (zoom_diff >= 0.4) refreshResults = true            
        }

        if (!isEqual(prevProps.pixelDistance, this.props.pixelDistance)) {
            // TODO: establish reproducable relationship between custer distance and icon size
            this.setState({ clusterSize: this.props.pixelDistance * 60 })
        }

        
        
        // Reset mergeTopPicks; if the results shoudl change
        if (refreshResults) this.setState({ mergeTopPicks: false })

        /* Handle UI State and Data Loading */
        if (this.props.detailsShown === true) updateData = false

        /* TODO: Not sure of the best react pattern for handling refresh state, but this works. */
        /* TODO: this logic can move to either actions or the VibeMap service */
        if (this.props.mapReady === true && !isEqual(prevProps.mapReady, this.props.mapReady)) {
            this.getBounds()
        }

        if (this.props.boundsReady === false) updateData = false
        // Only update data if the map and searh radius area ready. 
        if (this.props.mapReady && this.props.boundsReady && !isEqual(prevProps.boundsReady, this.props.boundsReady)) {
            updateData = true
        }

        /* Once map and radius are ready, fetch data */        
        if (updateData === true) this.getPlacesOrEvents(refreshResults)

    }

    // never let a process live forever 
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet)
            this.setState({ intervalIsSet: null })
        }
    }

    // Put the location in the URL
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
            this.fetchPlaces(true)
            this.fetchEvents(true)
            //this.fetchNeighborhoods()
        })
    }

    handleWindowSizeChange = () => {
        this.props.setWindowSize({
            height: window.innerHeight,
            width: window.innerWidth
        })        
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

    getBounds() {
        // TODO: There's probably a better place for these hooks. 
        let bounds = helpers.getBounds(this.props.currentLocation, this.props.zoom, this.props.mapSize)

        // Get the ratio of distance for each pixel on the screen; used for clustering
        this.props.setPixelDistance(helpers.getDistanceToPixels(bounds, this.props.windowSize))
        this.props.setBounds(bounds)
        this.props.setDistance(helpers.getRadius(bounds))
        this.props.setBoundsReady(true)
    }

    getPlacesOrEvents(refreshResults) {
        // TODO: Add preferece for places or events
        switch (this.props.placeType) {
            case 'events':            
                this.setState({ mergeTopPicks: false })
                this.fetchEvents(refreshResults)
                break
            case 'places':                
                this.setState({ mergeTopPicks: false })
                this.fetchPlaces(refreshResults)
                break
            // i.e. both
            default:
                this.setState({ mergeTopPicks: true })
                this.fetchEvents(refreshResults)
                this.fetchPlaces(refreshResults)
                break
        }
    }

    /* TODO: Should all of this logic just flow through an event service and component? */
    // Change to getPlaces
    fetchEvents(position, refreshResults) {

        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`
        if(this.state.timedOut === true) {
            this.setState({ timedOut: false })
        }
    
        /* Get current events, then set them in the state */
        /* TODO: package args into spread object? */        
        VibeMap.getEvents(point, this.props.distance, this.props.bounds, this.state.event_categories, this.props.currentDays, this.props.currentVibes, this.props.searchTerm)
            .then(results => {                

                let top_picks = results.data.splice(1, this.state.num_top_picks)
                // TODO: If both events and places, how to merge the results
                this.props.setTopPicks(top_picks, refreshResults, this.state.mergeTopPicks)
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

        if (this.state.timedOut === true) this.setState({ timedOut: false, searching: false })

        /* Get nearby places, then set them in the Redux state */
        // If there a search term or vibes do a top pick search
        if (this.props.currentVibes.length > 0 || this.props.searchTerm !== "") {
            this.setState({ searching: true})
            
            // TODO: add search variable.
            VibeMap.getPicks(point, this.props.distance, this.props.bounds, this.props.activity, this.props.currentVibes, this.props.searchTerm)
                .then(results => {                                        

                    if (results.top_vibes) {
                        this.props.setTopVibes(results.top_vibes)
                    }

                    let top_picks = results.data.splice(1, this.state.num_top_picks)
                    
                    let top_picks_clustered = VibeMap.clusterPlaces(top_picks, this.state.clusterSize)                                    
                    
                    this.props.setTopPicks(top_picks_clustered, refreshResults, this.state.mergeTopPicks)
                    this.props.setPlacesData(results.data, refreshResults)

            }, (error) => {
                console.log(error)
            })
        } else {
            this.setState({ searching: false }) 
        }

        VibeMap.getPlaces(point, this.props.distance, this.props.bounds, this.props.activity, this.props.currentDays, this.props.currentVibes, this.props.searchTerm)
            .then(results => {

                // TODO: Can this be dispatched from a central place? 
                this.props.setTopVibes(results.top_vibes)

                if(this.state.searching !== true) {                    
                    // This won't be needed if top picks work, right? 
                    let top_picks = results.data.splice(1, this.state.num_top_picks)
                    
                    // Example of DBSCAN clustering algorithm
                    // Size cluster for 20 px appart at each level
                    
                    let top_picks_clustered = VibeMap.clusterPlaces(top_picks, this.state.clusterSize)                    

                    this.props.setTopPicks(top_picks_clustered, refreshResults, this.state.mergeTopPicks)
                    
                    this.props.setPlacesData(results.data, refreshResults)
                } else {
                    // TODO: Only show places with vibe affinity during search
                    //this.props.setPlacesData(results.data, refreshResults)
                }
                
                this.setState({ loading: false, timedOut: false })
            }, (error) => {
                console.log(error)
            })
    }

    clearDetails = function() {
        this.props.history.replace('')

        this.props.setDetailsId(null)
        this.props.setDetailsType(null)
        this.props.setDetailsShown(false)

        let new_zoom = this.props.zoom - 1
        this.props.setZoom(new_zoom)
    }

    render() {

        const { width } = this.state

        // TODO: Set this in Redux for global access
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
                this.props.detailsShown ? (  
                    <PlaceDetails id={this.props.detailsId} clearDetails={this.clearDetails} />            
                    
                ) : (
                    <MobilePage data={this.props.eventsData} places_data={this.props.placesData} vibe_categories={this.state.vibe_categories} isMobile={isMobile} setLocationParams={this.setLocationParams} />
                )                          
            )
        } else {
            return (
                <React.Fragment>
                    {navigation}

                    {/* 16 column grid */}
                    <Grid id='content' className='content'>                       
                        <Grid.Row stretched className='collapsed'>
                            <Grid.Column floated='left' width={5} className='list_details'>
                                {
                                    /* TODO: Refactor into component */
                                    this.props.detailsShown ? (
                                        <PlaceDetails id={this.props.detailsId} clearDetails={this.clearDetails} />
                                    ) : (                                        
                                        <PlacesList data={this.props.topPicks} type='places' />
                                    )
                                }

                                {/* <EventsList data={this.state.data} /> */}
                                
                            </Grid.Column>
                            <Grid.Column width={11}>                                
                                <ErrorBoundary>                                    
                                    {events_map}
                                </ErrorBoundary>
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
    bounds: state.bounds,
    boundsReady: state.boundsReady,
    cities: state.cities,
    geod: state.geod,
    currentCategory: state.currentCategory,
    currentLocation: state.currentLocation,
    zoom: state.zoom,
    currentDays: state.currentDays,
    currentVibes: state.currentVibes,
    detailsShown: state.detailsShown,
    detailsId: state.detailsId,
    detailsType: state.detailsType,
    distance: state.distance,
    eventsData: state.eventsData,
    mapReady: state.mapReady,
    mapSize: state.mapSize,
    pixelDistance: state.pixelDistance,
    placesData: state.placesData,
    placeType: state.placeType,
    searchTerm: state.searchTerm,
    search: state.router.location.search,
    topPicks: state.topPicks,
    topVibes: state.topVibes,
    windowSize: state.windowSize,
    viewport: state.viewport
})

const EventsPage = connect(
    mapStateToProps,
    // Or actions
    actions
)(Page)

export default EventsPage
