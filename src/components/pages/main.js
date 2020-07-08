import React, { Component } from 'react'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import { store } from '../../redux/store'
import { push } from 'connected-react-router'

import { withRouter } from 'react-router-dom';

import qs from 'qs'
import isEqual from 'react-fast-compare'

import VibeMap from '../../services/VibeMap.js'

// TODO: move to services
import helpers from '../../helpers.js'
import * as Constants from '../../constants.js'

// Pages
import MobilePage from './mobile.js'

// Layouts
import TwoColumnLayout from '../layouts/TwoColumnLayout'
import ItemDetails from '../layouts/ItemDetails.js'
import ListSearch from '../layouts/ListSearch.js'

// Page elements
import Header from '../elements/header.js'
import Navigation from '../events/navigation.js'
import EventsMap from '../events/events_map.js'

//import PlaceCards from '../places/place_cards.js'

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
            // TODO: handle conversion math in VibeMap
            intervalIsSet: false,
            loading: true,
            num_top_picks: 10,
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

        // Load vibes from API
        this.fetchCities()
        this.fetchVibes()
        this.fetchCategories()

        // Set global state with user's location from query string
        let params = qs.parse(this.props.search, { ignoreQueryPrefix: true })
        
        // If no coordinates are in the url, get the user's locations
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
        if (!isEqual(prevProps.vibes, this.props.vibes)) {
            updateData = true
            refreshResults = true
        }

        if (!isEqual(prevProps.searchTerm, this.props.searchTerm) && this.props.searchTerm.length > 2) {
            console.log('New search term: ', this.props.searchTerm)
            updateData = true
            refreshResults = true
        }

        if (!isEqual(prevProps.activity, this.props.activity)) {
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

        if (!isEqual(prevProps.currentPage, this.props.currentPage)) {
            refreshResults = true
            this.pageTopPicks(refreshResults)
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
            this.getBounds()
            // Only refresh if it a whole step up or down
            let zoom_diff = Math.abs(this.props.zoom - prevProps.zoom)
            if (zoom_diff >= 0.4) refreshResults = true            
        }

        if (!isEqual(prevProps.pixelDistance, this.props.pixelDistance)) {
            // TODO: establish reproducable relationship between custer distance and icon size
            this.setState({ clusterSize: this.props.pixelDistance * 60 })
        }

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

        // Reset mergeTopPicks; if the results shoudl change
        if (refreshResults) this.setState({ mergeTopPicks: false })
        
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
        let params = qs.parse(this.props.search, { ignoreQueryPrefix: true })

        params["latitude"] = location.latitude
        params["longitude"] = location.longitude
        
        let string = qs.stringify(params)
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

    // TODO: consider breaking these out as a separate service/container that only fetches data
    fetchGuides() {
        VibeMap.getGuides()
            .then(results => {
                this.props.setGuidesData(results.data)
            })
    }

    fetchCities() {
        VibeMap.getCities()
            .then(results => {                
                this.props.setCities(results.data)
            })
    }

    fetchVibes() {
        VibeMap.getVibes()
            .then(results => {                
                this.props.setVibesets(results.data['signature_vibes'])
                this.props.setAllVibes(results.data['all_vibes'])                
            })
    }

    fetchCategories() {
        VibeMap.getCategories()
            .then(results => {
                //this.props.setVibesets(results.data['signature_vibes'])
                this.props.setAllCategories(results.data['place_categories'])
            })
    }

    fetchNeighborhoods() {
        VibeMap.getNeighborhoods()
            .then(results => {
                this.props.setNeighborhoods(results.data)
            })
    }

    /* TODO: Should all of this logic just flow through an event service and component? */
    // Change to getPlaces
    fetchEvents(position, refreshResults) {

        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`
        if (this.state.timedOut === true) {
            this.setState({ timedOut: false })
        }

        /* Get current events, then set them in the state */
        /* TODO: package args into spread object? */
        VibeMap.getEvents(point, this.props.distance, this.props.bounds, this.state.event_categories, this.props.days, this.props.vibes, this.props.searchTerm)
            .then(results => {

                const page = this.props.currentPage

                let top_picks = results.data.splice(page, page + this.state.num_top_picks)
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
    fetchPlaces(refreshResults) {

        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`

        if (this.state.timedOut === true) this.setState({ timedOut: false, searching: false })

        /* Get nearby places, then set them in the Redux state */
        // If there a search term or vibes do a top pick search
        if (this.props.vibes.length > 0 || this.props.searchTerm !== "") {
            this.setState({ searching: true })

            // TODO: add search variable.
            VibeMap.getPicks(point, this.props.distance, this.props.bounds, this.props.activity, this.props.vibes, this.props.searchTerm)
                .then(results => {
                    // Set places in he results
                    this.setTopPlaces(results, refreshResults)

                }, (error) => {
                    console.log(error)
                })
        } else {
            this.setState({ searching: false })
        }

        VibeMap.getPlaces(point, this.props.distance, this.props.bounds, this.props.activity, this.props.days, this.props.vibes, this.props.searchTerm)
            .then(results => {

                if (this.state.searching !== true) {
                    this.setTopPlaces(results, refreshResults)
                } else {
                    // TODO: Only show places with vibe affinity during search
                    //this.props.setPlacesData(results.data, refreshResults)
                }

                this.setState({ loading: false, timedOut: false })
            }, (error) => {
                console.log(error)
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

        return bounds
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
            case 'guides':
                this.setState({ mergeTopPicks: false })
                this.fetchGuides()
                //this.fetchPlaces(refreshResults)
                break
            // i.e. both
            default:
                this.setState({ mergeTopPicks: true })
                this.fetchEvents(refreshResults)
                this.fetchPlaces(refreshResults)
                break
        }
    }

    setTopPlaces(results, refreshResults) {
        if (results.top_vibes) {
            this.props.setTopVibes(results.top_vibes)
        }

        let count = results.count
        let area = helpers.getArea(this.props.bounds)
        let density = count / area
        let relative_density = helpers.scaleDensityArea(density)
        let density_bonus = helpers.scaleDensityBonus(relative_density)
        this.props.setDensityBonus(density_bonus)

        console.log('relative_density, inverted scale: ', relative_density, density_bonus)
        console.log('density (points, area in mi, density): ', count, area, density)

        const page = this.props.currentPage
        const first = page * this.state.num_top_picks
        const last = first + this.state.num_top_picks

        console.log('first and last page: ', first, last)

        let top_picks = results.data.splice(first, last)

        let num_results = results.data.length
        let num_pages = Math.floor(num_results / this.state.num_top_picks) - 1
        let wildcard = Math.floor(Math.random() * num_results)

        // TODO: consider adding and highlighting a wildcard result         
        // top_picks.push(results.data[wildcard])

        let top_picks_clustered = VibeMap.clusterPlaces(top_picks, this.state.clusterSize)

        this.props.setTopPicks(top_picks_clustered, refreshResults, this.state.mergeTopPicks)

        this.props.setTotalPages(num_pages)
        this.props.setPlacesData(results.data, refreshResults)
    }

    pageTopPicks(refreshResults) {
        const page = this.props.currentPage
        const first = page * this.state.num_top_picks + 1
        const last = first + this.state.num_top_picks

        console.log('first and last page: ', first, last, refreshResults, this.state.mergeTopPicks)

        let top_picks = this.props.placesData.slice(first, last)

        console.log('top_picks of total: ', top_picks, this.props.placesData.length)
        this.props.setTopPicks(top_picks, refreshResults, this.state.mergeTopPicks)
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
        const { placeType, guidesData, topPicks } = this.props

        // TODO: Set this in Redux for global access
        const isMobile = width <= 700

        let Map = <EventsMap searchTerm={this.props.searchTerm} events_data={this.props.eventsData} places_data={this.props.placesData} zoom={this.props.detailsShown ? 16 : this.props.zoom} setPosition={this.setPosition} setLocationParams={this.setLocationParams} />
        
        // Pick the list that should be display
        let list_data = null
        if (placeType === 'places' || placeType === 'events') list_data = topPicks
        if (placeType === 'guides' ) list_data = guidesData

        // TODOL Also handle guide here.
        let LeftPanel = <ListSearch data={list_data} type='places' />

        if (this.props.detailsShown) {
            LeftPanel = <ItemDetails id={this.props.detailsId} clearDetails={this.clearDetails} />
        }

        // Don't render until the data has loaded
        // TODO: Handle error versus no results versus still loading

        // Adaptive view for mobile users
        if (isMobile) {
            return ( 
                this.props.detailsShown ? (  
                    <ItemDetails id={this.props.detailsId} clearDetails={this.clearDetails} />
                ) : (
                    <MobilePage data={this.props.eventsData} places_data={this.props.placesData} vibe_categories={this.state.vibe_categories} isMobile={isMobile} setLocationParams={this.setLocationParams} />
                )
            )
        } else {
            return (
                <React.Fragment>
                    
                    <Header/>

                    <Navigation
                        setActivity={this.setActivity}
                        days={this.props.days}
                        activities={this.state.event_categories}
                        activity={this.state.activity}
                        isMobile={isMobile} />                    

                    <TwoColumnLayout
                        leftPanel={LeftPanel}
                        rightPanel={Map}
                        showLeft={this.props.showList}/>
                    
                </React.Fragment>
            )
        }
    }
}

const mapStateToProps = state => ({
    activity: state.nav.activity,
    allCategories: state.nav.allCategories,
    allVibes: state.nav.allVibes,
    // Map
    bounds: state.map.bounds,
    boundsReady: state.map.boundsReady,
    densityBonus: state.map.densityBonus,
    distance: state.map.distance,
    mapReady: state.map.mapReady,
    mapSize: state.map.mapSize,
    pixelDistance: state.map.pixelDistance,
    viewport: state.map.viewport,
    zoom: state.map.zoom,

    // Navigation
    cities: state.nav.allCities,
    currentLocation: state.nav.currentLocation,
    currentPage: state.nav.currentPage,
    days: state.nav.days,
    vibes: state.nav.vibes,
    detailsShown: state.detailsShown,
    detailsId: state.detailsId,
    detailsType: state.detailsType,
    eventsData: state.eventsData,
    guidesData: state.guidesData,
    placesData: state.placesData,
    placeType: state.placeType,
    searchTerm: state.nav.searchTerm,
    search: state.router.location.search,
    showList: state.showList,
    totalPages: state.nav.totalPages,
    topPicks: state.topPicks,
    topVibes: state.topVibes,
    windowSize: state.windowSize,
})

const EventsPage = connect(
    mapStateToProps,
    // Or actions
    actions
)(Page)

export default withRouter(EventsPage)