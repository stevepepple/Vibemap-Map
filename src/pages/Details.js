import React, { Component, Fragment } from 'react'
import { connect } from "react-redux"
import { detailsReceived, getDetails } from '../redux/actions'
import { withRouter } from "react-router"

import { isMobile } from 'react-device-detect';
import { MediaMatcher } from 'react-media-match'

import SEO from '../components/seo/'
import * as Constants from '../constants.js'

import { Button, Placeholder, Segment } from 'semantic-ui-react'

import TopMenu from '../components/elements/topMenu.js'
import Header from '../components/elements/header.js'
import Profile from '../components/layouts/Profile'

import { default as PlaceHeader } from '../components/places/header'
import Logo from '../components/elements/logo.js'
import Vibe from '../components/places/vibe'
import Plan from '../components/places/plan'
import Tips from '../components/places/tips'
import AppLink from '../components/elements/AppLink'
import AppStoreLink from '../components/elements/AppStoreLink'
import SocialShare from '../components/elements/SocialShare'

import Map from '../components/map'
import Selected from '../components/map/selected'
import { Marker } from 'react-map-gl'

import '../styles/place_details.scss'
import './Details.scss'

class Details extends Component {

  static async getInitialProps({ req, res, match, store }) {

    // Match handles any params in the URL
    const id = match.params.id
    let type = 'places'

    let details = await getDetails(id, type)

    store.dispatch(detailsReceived(details))

  }

  constructor(props) {
    super(props)

    this.state = {
      currentSection: 'vibe',
      id: null,
      vibes: [],
      marker_size: 3,
      vibes_expanded: false,
      vibes_to_show: 8
    }

    this.handleScroll = this.handleScroll.bind(this)
    this.onViewportChange = this.onViewportChange.bind(this)
  }

  // Example hook
  getParams() {
    let params = useParams()
  }

  detectSections() {
    const { sections } = this.props

    let sections_with_bounds = sections

    sections_with_bounds.forEach((item) => {
      const element = document.getElementById(item.key)
      const bounds = element.getBoundingClientRect()
      const offsetTop = element.offsetTop
      const offsetHeight = element.offsetHeight

      item.top = offsetTop - 200
      item.bottom = item.top + offsetHeight
      console.log('tab section bounds (top, bottom): ', item.top, item.bottom)

    })

    this.setState({ sections: sections_with_bounds })
  }


  handleScroll(event) {

    this.detectSections()

    const { clientHeight, scrollHeight, scrollTop } = event.target
    const { currentSection } = this.state
    const { sections } = this.props

    let offsetTop = window.pageYOffset;
    console.log('tab scrolling: ', scrollTop, scrollHeight, offsetTop)

    const scrolledDown = scrollTop > 160
    let current = null

    sections.forEach((item) => {
      if (scrollTop >= item.top && scrollTop < item.bottom) {
        current = item.key
        console.log('New current tab: ', current)
      }
    })

    this.setState({ showTabs: scrolledDown, currentSection: current })

    if (scrollHeight - scrollTop === clientHeight) {
      console.log('Scrolled to bottom!')
    }
  }


  scrollToTab(tab) {

    const { offset } = this.state
    // If browser    
    //window.scrollTo(0, this.moreRef.current.offsetTop)  

    //this.refs[tab].current.scrollIntoView(true)
    const details = document.getElementById('details')
    const anchorTarget = document.getElementById(tab)

    anchorTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


  onViewportChange(viewport) {
    console.log('Viewport changed: ', viewport)
  }

  render() {

    const { loading, currentItem, currentSection, mapboxToken, sections } = this.props
    const { marker_size, vibes_expanded } = this.state

    let { address, reason } = currentItem

    //console.log('getParams: ', this.getParams())

    // Recommendation
    if (reason === undefined) reason = 'vibe'
    reason = Constants.RECOMMENDATION_REASONS[reason]
    // TODO: connect so same logic as mobile 
    const recommendation = { score: '95%', reason: reason }

    if (loading === false && currentItem == null) { return 'No data for the component.' }

    const tabs = sections.map((section) => {
      return <a
        className={(section.key === currentSection) ? 'active item' : 'item'}
        key={section.key}
        onClick={this.scrollToTab.bind(this, section.key)}>
        {section.text}
      </a>
    })

    let profile = <Fragment>
      <div className='header'>
        <PlaceHeader loading={loading} currentItem={currentItem} recommendation={recommendation} />
        <div className='ui pointing secondary menu'>
          {tabs}
        </div>
      </div>
      <div className='profile'>
        <Vibe loading={loading} currentItem={currentItem} vibes_expanded={vibes_expanded} />
        <Plan loading={loading} currentItem={currentItem} />
        <Tips loading={loading} currentItem={currentItem} />
        <section id='more' ref={this.moreRef}>
          <AppStoreLink />
        </section>
      </div>

    </Fragment>

    let map = <div className='map'>
      {loading === false && currentItem.location !== null &&
        <Fragment>
          <Map
            loading={loading}
            longitude={currentItem.location.longitude}
            latitude={currentItem.location.latitude}
            mapboxToken={mapboxToken}
            currentItem={currentItem}
            onViewportChange={this.onViewportChange}
            height='24rem'
            width='100%'
            zoom={15}>
            <Marker
              longitude={currentItem.location.longitude}
              latitude={currentItem.location.latitude}
              offsetTop={-2}
              offsetLeft={-2}>
              <Selected size={marker_size} />
            </Marker>
          </Map>
          <div className='address'>
            {address ? address : t('No location')}
          </div>
          <SocialShare/>
        </Fragment>
      }
    </div>

    let web = <Profile leftPanel={profile} rightPanel={map} />

    let mobile = <div>
      <AppLink />
      {profile}
      {map}
    </div>

    return (
      <div id='details' 
        className={'DetailsPage ' + (isMobile ? 'mobile' : 'web')}
        onScroll={this.handleScroll}>
        { isMobile == false && 
          <TopMenu />
        }
        <Header isMobile={isMobile} />

        <SEO
          title={currentItem.name}
          description={currentItem.description}
        />

        <MediaMatcher
          desktop={web}
          mobile={mobile} />

      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentItem: state.places.currentItem,
  details: state.details,
  loading: state.loading,
  mapboxToken: state.mapboxToken,
  name: state.name,
  loading: state.places.loading,
  sections: state.places.sections
});

export default connect(mapStateToProps)(withRouter(Details));
