import React, { Component } from 'react'
import Media from 'react-media'

// REDUX STUFF
import { connect } from 'react-redux'
import { fetchCities } from '../app/actions/actions'

// Router, Mobile, & SEO
import { Helmet } from 'react-helmet'
import { MediaMatcher, pickMatch } from 'react-media-match';
import { withRouter } from "react-router";
import SEO from '../components/seo/'


// Page elements
import Header from '../components/elements/header.js'
import Navigation from '../components/events/navigation.js'
import Map from '../components/map'

import { Placeholder } from 'semantic-ui-react'


import './Main.scss';

class Main extends Component {

  static async getInitialProps({ req, res, match, store }) {

    // Match handles any params in the URL
    const id = match.params.id

    const params = req.query

    console.log('URL path on main: ', params, match )

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

  // Aever let a process live forever 
  // always kill a process everytime we are done using it
  componentDidMount() {
    // TODO: Pattern for if data is loaded or errored out
    fetchCities()
    if (!this.props.cities) {
      //this.props.dispatch(Main.initialAction())
    }

    console.log('Browser history: ', this.props.history)

    let { history } = this.props

    history.push({ search: '?test=test' })
    
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet)
      this.setState({ intervalIsSet: null })
    }
  }

  render() {
    let { cities } = this.props

    let isMobile = pickMatch(this.context, {
      mobile: true,
      desktop: false
    })

    console.log('isMobile: ', isMobile)

    let navigation = <Navigation
      activities={this.state.event_categories}
      activity={this.state.activity}
      isMobile={isMobile} />


    let mobile = <div>
      { navigation }
      Mobile here. The document is less than 600px wide.

    </div>
    let web = <div>
      { navigation }
      Web here. The document is at least 600px wide.
    </div>

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
  cities: state.cities
});

export default connect(mapStateToProps)(Main);
