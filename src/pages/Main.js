import React, { Component } from 'react'
import Media from 'react-media'

// REDUX STUFF
import { connect } from 'react-redux'
import { fetchCities, fetchVibes, setPlaceType } from '../redux/actions'

// Router, Mobile, & SEO
import { Helmet } from 'react-helmet'
import { MediaMatcher, pickMatch } from 'react-media-match';
import { withRouter } from "react-router";
import SEO from '../components/seo/'


// Page elements
import Header from '../components/elements/header.js'
import Navigation from '../components/events/navigation.js'
import Map from '../components/map'

// Layouts
import TwoColumnLayout from '../components/layouts/TwoColumnLayout'
import ItemDetails from '../components/layouts/ItemDetails.js'
import ListSearch from '../components/layouts/ListSearch.js'

import { Placeholder } from 'semantic-ui-react'


import './Main.scss';

class Main extends Component {

  static async getInitialProps({ req, res, match, store }) {

    // Match handles any params in the URL
    const id = match.params.id

    try {
      const params = req.query
      const { place_type, activity } = params
      console.log('URL path on main: ', params)
      
      // Set Redux Store from URL on server so it can be used for SEO
      if (place_type) store.dispatch(setPlaceType(place_type))
      if (activity) {
        store.dispatch(setActivity(activity))
        store.dispatch(lookUpActivity(activity))

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
    console.log("Main component did mount")
    //fetchCities()
    let vibes = this.props.fetchVibes()


    if (!this.props.cities) {
      //this.props.dispatch(Main.initialAction())
    }

    let { history } = this.props
    
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

    const Map = <div>Map will go here</div>

    let mobile = <div>
      { navigation }
      Mobile here. The document is less than 600px wide.

    </div>
    let web = <div>
      <Header />
      { navigation }
      Web here. The document is at least 600px wide.
    </div>

    return (
      <div className="Main">
        <SEO/>

        <MediaMatcher
          desktop={web}
          mobile={mobile} />
        
        <TwoColumnLayout
          leftPanel={LeftPanel}
          rightPanel={Map}
          showLeft={this.props.showList} />


      </div>
    );
  }
}

const mapStateToProps = state => ({
  cities: state.cities,
  showList: state.showList
});

const mapDispatchToProps = dispatch => ({ 
  fetchVibes: () => dispatch(fetchVibes()) 
})


export default connect(mapStateToProps, mapDispatchToProps)(Main);
