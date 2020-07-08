import React, { Component, Fragment } from 'react'
import Media from 'react-media'

// REDUX STUFF
import { connect } from 'react-redux'
import { fetchCategories, fetchCities, fetchVibes, setPlaceType, setZoom } from '../redux/actions'

// Router, Mobile, & SEO
import { MediaMatcher, pickMatch } from 'react-media-match';
import SEO from '../components/seo/'

// TODO: MOve to compnoents
import './Main.scss'

// Page elements
import Header from '../components/elements/header.js'
import Navigation from '../components/events/navigation.js'
import EventsMap from '../components/events/events_map.js'
//import Map from '../components/map'


// Layouts
import TwoColumnLayout from '../components/layouts/TwoColumnLayout'
import ItemDetails from '../components/layouts/ItemDetails.js'
import ListSearch from '../components/layouts/ListSearch.js'

import './Main.scss';

class Main extends Component {

  static async getInitialProps({ req, res, match, store }) {

    // Match handles any params in the URL
    const id = match.params.id

    try {
      const params = req.query
      const { place_type, activity, longitude, latitude, zoom } = params
      console.log('URL path on main: ', params)

      // TODO: Handle browser vs. client logic here.
      
      // Set Redux Store from URL on server so it can be used for SEO
      if (place_type) store.dispatch(setPlaceType(place_type))
      
      if (latitude && longitude) store.dispatch(setCurrentLocation({ latitude: latitude, longitude: longitude }))
      if (zoom) store.dispatch(setZoom(zoom))

      if (activity) {
        store.dispatch(setActivity(activity))
        store.dispatch(lookUpActivity(activity))
      }  else {
        helpers.getPosition()
          .then((position) => {
            if (position) {
              this.props.setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
            } else {
              // TODO: what if the user disallows location
            }
          })
      }

    } catch (error) {
      console.log('Problem parsing history.')
    }


    if (match.params.city) {
      console.log('Handle route for city: ', match.params.city)
    }

    //let type = 'places'

    //let details = await getDetails(id, type)

    //details = store.dispatch(detailsReceived(details))
  }

  constructor(props) {
    super(props)

    // State includes some globals only for the main page; 
    // Most other UI state is managed by Redux
    this.state = {
      clusterSize: 80,
      // TODO: set state form YAML
      event_categories: [/.*.*/, 'art', 'arts', 'comedy', 'community', 'food', 'food & drink', 'festive', 'free', 'local', 'other', 'recurs', 'music', 'urban'],
      place_categories: ['Arts & Entertainment', 'Food'],
      intervalIsSet: false,
      loading: true,
      num_top_picks: 10,
      timedOut: false,
      mergeTopPicks: false,
      time_of_day: 'morning'
      // Used for mobile adaptive layout
    }
  }

  componentDidMount() {
    // TODO: Pattern for if data is loaded or errored out
    console.log("Main component did mount", this.props)

    const cities = this.props.fetchCities()
    const vibes = this.props.fetchVibes()
    const categories = this.props.fetchCategories()

    if (!this.props.cities) {
      //this.props.dispatch(Main.initialAction())
    }

    const isBrowser = !!((typeof window !== 'undefined' && window.document && window.document.createElement))

    console.log('isBrowser: ', isBrowser)
    
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
    let { cities, history, detailsShown, placeType } = this.props

    let isMobile = pickMatch(this.context, {
      mobile: true,
      desktop: false
    })

    console.log('isMobile: ', isMobile)

    let navigation = <Navigation
      activities={this.state.event_categories}
      activity={this.state.activity}
      isMobile={isMobile} />


    // Pick the list that should be display
    let list_data = null
    if (placeType === 'places' || placeType === 'events') list_data = topPicks
    if (placeType === 'guides') list_data = guidesData


    // TODOL Also handle guide here.
    const LeftPanel = detailsShown ?
      <ItemDetails id={this.props.detailsId} clearDetails={this.clearDetails} /> :      
      <ListSearch data={list_data} type='places' />

    const Map = <EventsMap setLocationParams={this.setLocationParams} />

    let mobile = <div>
      { navigation }
      Mobile here. The document is less than 600px wide.

    </div>
    let web = <Fragment>
      <Header />
      { navigation }
      <TwoColumnLayout
        leftPanel={LeftPanel}
        rightPanel={Map}
        showLeft={this.props.showList} />
    </Fragment>

    return (
      <div className="Main">
        <SEO/>

        <MediaMatcher
          desktop={web}
          mobile={mobile} />

      </div>
    );
  }
}

const mapStateToProps = state => ({
  cities: state.nav.allCities,
  searchTerm: state.nav.searchTerm,

  showList: state.showList,
  topPicks: state.topPicks,

  zoom: state.map.zoom

});

const mapDispatchToProps = dispatch => ({
  fetchCategories: () => dispatch(fetchCategories()), 
  fetchCities: () => dispatch(fetchCities()), 
  fetchVibes: () => dispatch(fetchVibes()),
  setZoom: () => dispatch(setZoom())
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
