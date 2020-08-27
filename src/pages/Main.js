import React, { Component, Fragment } from 'react'
import isEqual from 'react-fast-compare'
import helpers from '../helpers.js'

import debounce from 'lodash.debounce'

// Router, Mobile, & SEO
import { MediaMatcher, pickMatch, MediaConsumer } from 'react-media-match';
import { isMobile } from 'react-device-detect';
import SEO from '../components/seo/'

// Page elements
import Header from '../components/elements/header.js'
import Logo from '../components/elements/logo.js'
import AppLink from '../components/elements/AppLink'

import dayjs from 'dayjs'

import Navigation from '../components/events/navigation.js'
import EventsMap from '../components/events/events_map.js'
//import Map from '../components/map'
import './Main.scss'

// Layouts
import TwoColumnLayout from '../components/layouts/TwoColumnLayout'
import ItemDetails from '../components/layouts/ItemDetails.js'
import ListSearch from '../components/layouts/ListSearch.js'
import MobileList from '../components/layouts/MobileList.js'

// Localization
import { withTranslation } from 'react-i18next';

import './Main.scss';

// REDUX STUFF
import { connect } from 'react-redux'
import * as actions from '../redux/actions'

class Main extends Component {

    // Get initial props from server-side
    static async getInitialProps({ req, res, match, store }) {

        try {
            const params = req.query
            const { place_type, activity, longitude, latitude, zoom } = params

            // Set Redux Store from URL on server so it can be used for SEO
            if (place_type) store.dispatch(setPlaceType(place_type))

            if (latitude && longitude) {
                store.dispatch(setCurrentLocation({ latitude: latitude, longitude: longitude }))
                this.setState({ hasLocation : true })
            } 
            if (zoom) store.dispatch(setZoom(zoom))

            if (activity) {
                store.dispatch(setActivity(activity))
                store.dispatch(lookUpActivity(activity))
            } 

        } catch (error) { console.log('Problem parsing history.')}


        if (match.params.city) {
            console.log('Handle route for city: ', match.params.city)
        }
    }

    constructor(props) {
        super(props)

        // State includes some globals only for the main page; 
        // Most other UI state is managed by Redux
        this.state = {
            // TODO: set state form YAML
            event_categories: [/.*.*/, 'art', 'arts', 'comedy', 'community', 'food', 'food & drink', 'festive', 'free', 'local', 'other', 'recurs', 'music', 'urban'],
            place_categories: ['Arts & Entertainment', 'Food'],
            hasLocation: false,
            intervalIsSet: false,
            loading: true,
            timedOut: false,
            mergeTopPicks: false,
            time_of_day: 'morning'
        }
    }

    componentDidMount() {

        // TODO: Pattern for if data is loaded or errored out
        const { fetchCities, fetchVibes, fetchCategories, i18n, language, setIsBrowser, setCurrentLocation } = this.props
        const { hasLocation } = this.state

        // Set current language from backend store
        i18n.changeLanguage(language);

        // Always do a fresh load of UI
        fetchCities()
        fetchVibes()
        fetchCategories()
            .then(() => this.setState({ loading: false }))
                
        // And data
        this.fetchPlaces(true)

        // Store Browser or Server this in Redux
        const isBrowser = !!((typeof window !== 'undefined' && window.document && window.document.createElement))
        setIsBrowser(isBrowser)

        if (isBrowser) {
            window.addEventListener('resize', this.handleWindowSizeChange)

            if(hasLocation == false) {
                helpers.getPosition()
                    .then((position) => {
                        if (position) {
                            const location = { latitude: position.coords.latitude, longitude: position.coords.longitude }

                            setCurrentLocation(location)
                        } else {
                            // TODO: what if the user disallows location
                        }
                    })
            }
        }

    }

    // Should update and Debounce API Requests
    componentDidUpdate(prevProps, prevState) {

        // TODO: should be a switch statement? 
        let updateData = false
        let refreshResults = false

        const map_is_ready = this.props.mapReady === true && !isEqual(prevProps.mapReady, this.props.mapReady)
        const bounds_ready = !isEqual(prevProps.boundsReady, this.props.boundsReady)
        if (map_is_ready) this.getBounds()

        // TODO: Move this to actions or service layer as shouldFetchData        
        // TODO: measure distance between current and previous event
        // TODO: Only refesh if the map moved by a significant jump...
        // If they close together, merge the data in fetchPlaces.
        const location_changed = !isEqual(prevProps.currentLocation.latitude, this.props.currentLocation.latitude)
        const vibe_changed = !isEqual(prevProps.vibes, this.props.vibes)
        const search_changed = !isEqual(prevProps.searchTerm, this.props.searchTerm) && (this.props.searchTerm.length === 0 || this.props.searchTerm.length > 2)
        const activity_changed = !isEqual(prevProps.activity, this.props.activity)
        const place_type_changed = !isEqual(prevProps.placeType, this.props.placeType)
        const page_changed = !isEqual(prevProps.currentPage, this.props.currentPage)
        const pixels_changed = !isEqual(prevProps.pixelDistance, this.props.pixelDistance)
        const zoom_changed = !isEqual(prevProps.zoom, this.props.zoom)
        const details_changed = !isEqual(prevProps.detailsShown, this.props.detailsShown)

        // Conditions for fetch
        if (vibe_changed || search_changed || activity_changed || place_type_changed || location_changed || zoom_changed ) {
            updateData = true
            refreshResults = true 
        }

        if (zoom_changed) {
            // Only refresh if it a whole step up or down
            let zoom_diff = Math.abs(this.props.zoom - prevProps.zoom)
            if (zoom_diff <= 0.4) refreshResults = false
            this.getBounds()
        }

        if (details_changed) this.getBounds()

        if (page_changed) {
            refreshResults = true
            this.pageTopPicks(refreshResults)
        }

        // TODO: establish reproducable relationship between custer distance and icon size
        if (pixels_changed) this.setState({ clusterSize: this.props.pixelDistance * 60 })

        /* Handle UI State and Data Loading */
        if (this.props.detailsShown === true) updateData = false

        /* TODO: Not sure of the best react pattern for handling refresh state, but this works. */
        /* TODO: this logic can move to either actions or the VibeMap service */
        if (this.props.boundsReady === false) updateData = false

        // Only update data if the map and searh radius area ready. 
        if (this.props.mapReady && this.props.boundsReady && bounds_ready) updateData = true

        // Reset mergeTopPicks; if the results should change
        if (refreshResults) this.setState({ mergeTopPicks: false })

        /* Once map and radius are ready, fetch data */
        if (updateData === true) this.getPlacesOrEvents(refreshResults)        
    }

    getPlacesOrEvents = debounce((refreshResults) => {
        
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
    }, 500, { leading: false, trailing: true})

    // Wrapping a function handled by Thunk calls to the Vibemap service
    fetchPlaces(refreshResults) {

        let currentTime = dayjs().toISOString()

        const { distance, bounds, currentLocation, activity, days, vibes, searchTerm } = this.props
        const point = `${currentLocation.longitude},${currentLocation.latitude}`

        // TODO: Set in action dispatch, not here
        if (this.state.timedOut === true) this.setState({ timedOut: false, searching: false })
        
        let args = [point, distance, bounds, activity, days, vibes, searchTerm, currentTime, refreshResults]
        
        // Important: This fetches the data and update the state in Redux
        const places = this.props.fetchPlaces(...args, refreshResults)
    }

    fetchEvents(refreshResults) {

    }

    // TODO: MOve to an action getter/setter
    // Or aleast combine with the map logic
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

    pageTopPicks(refreshResults) {
        const { currentPage, placesData, numTopPicks, setTopPicks} = this.props
        const first = currentPage * numTopPicks
        const last = first + numTopPicks

        let top_picks = placesData.slice(first, last)
        setTopPicks(top_picks, refreshResults, this.state.mergeTopPicks)
    }

    handleWindowSizeChange = () => {
        this.props.setWindowSize({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    // Aever let a process live forever 
    // always kill a process everytime we are done using it
    componentWillUnmount() {
        if (this.state.intervalIsSet) {
            clearInterval(this.state.intervalIsSet)
            this.setState({ intervalIsSet: null })
        }
    }

    render() {
        let { cities, history, detailsShown, placeType, placesLoading, topPicks } = this.props
        const { loading, width } = this.state


        const size = (isMobile) ? 100 : 140

        if (loading) return (<div className="full-page-loader" style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
            <Logo size={size} />
        </div>)

        let navigation = <Navigation
            activities={this.state.event_categories}
            activity={this.state.activity}
            isMobile={isMobile} />

        // Pick the list that should be display
        // TODO: Create a cleary way to manage the state between events, places, adn guides. 
        let list_data = null
        if (placeType === 'places' || placeType === 'events') list_data = topPicks
        if (placeType === 'guides') list_data = guidesData

        // TODOL Also handle guide here.
        const LeftPanel = detailsShown ?
            <ItemDetails id={this.props.detailsId} clearDetails={this.clearDetails} /> :
            <ListSearch data={list_data} type='places' />

        const Map = <Fragment>
            {placesLoading && <Logo size={100} /> }

            <EventsMap 
                setLocationParams={this.setLocationParams} 
                isMobile={isMobile} />
        </Fragment>

        let mobile = <Fragment>
            <AppLink />
            <Header isMobile={isMobile} />
            {Map}
            <MobileList isMobile={true}/>
        </Fragment>

        let web = <Fragment>
            <Header />
            {navigation}
            <TwoColumnLayout
                leftPanel={LeftPanel}
                rightPanel={Map}
                showLeft={this.props.showList} />
        </Fragment>

        return (
            <div className={'Main ' + (isMobile ? 'mobile' : 'web')}>
                <SEO />

                <MediaMatcher
                    desktop={web}
                    mobile={mobile} />

            </div>
        );
    }
}

const mapDispatchToProps = {
    ...actions
}

// Map is a container component that manages the following state with Redux Thunks
const mapStateToProps = state => ({
    isBrowser: state.isBrowser,
    language: state.language,
    mapboxToken: state.mapboxToken,

    // Map
    bounds: state.map.bounds,
    boundsReady: state.map.boundsReady,
    distance: state.map.distance,
    layersChanged: state.map.layersChanged,
    mapSize: state.map.mapSize,
    mapReady: state.map.mapReady,
    numTopPicks: state.map.numTopPicks,
    pixelDistance: state.map.pixelDistance,
    zoom: state.map.zoom,
    
    // Navigation
    activity: state.nav.activity,
    cities: state.nav.allCities,
    currentLocation: state.nav.currentLocation,
    currentPage: state.nav.currentPage,
    placeType: state.nav.placeType,
    searchTerm: state.nav.searchTerm,
    vibes: state.nav.vibes,
    
    // Place
    detailsId: state.places.detailsId,
    placesData: state.placesData,
    placesLoading: state.places.placesLoading,
    
    // List
    detailsShown: state.detailsShown,
    showList: state.showList,
    topPicks: state.topPicks,
    windowSize: state.windowSize
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Main));