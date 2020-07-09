import React, { Component, Fragment } from 'react'

import { Placeholder } from 'semantic-ui-react'

import { MediaMatcher } from 'react-media-match';
import { withRouter } from "react-router";

import SEO from '../components/seo/'

import Vibe from '../components/places/vibe'
import Plan from '../components/places/plan'

import Map from '../components/map'
import Selected from '../components/map/selected'

import Profile from '../components/layouts/Profile'

import { Marker } from 'react-map-gl'

import { connect } from "react-redux"
import { detailsReceived, getDetails } from '../redux/actions'

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

    this.state =  {
      id: null,
      vibes: [],
      marker_size: 12,
      vibes_expanded: false,
      vibes_to_show: 8
    }

      this.onViewportChange = this.onViewportChange.bind(this)
  }

  // Example hook
  getParams() {
    let params = useParams()
  }


  onViewportChange(viewport) {
    console.log('Viewport changed: ', viewport)
  }

  render() {

    const { loading, currentItem } = this.props

    const { marker_size, vibes_expanded } = this.state

    //console.log('getParams: ', this.getParams())

    if (loading === false && currentItem == null) { return 'No data for the component.' }

    let profile = <Fragment>
      { loading ? (
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line length='very short' />
            <Placeholder.Line length='medium' />
          </Placeholder.Header>
        </Placeholder>
      ) : (
          <h2>{currentItem.name}</h2>
        )}

      <p> Id is: {this.state.id}, {loading}</p>

      <Vibe loading={loading} currentItem={currentItem} vibes_expanded={vibes_expanded} />
      <Plan loading={loading} currentItem={currentItem} />
    </Fragment>

    let map = <div>
      {loading === false && currentItem.location !== null &&
        <Map
          loading={loading}
          longitude={currentItem.location.longitude}
          latitude={currentItem.location.latitude}
          currentItem={currentItem}
          onViewportChange={this.onViewportChange}
          zoom={15}>
          <Marker
            longitude={currentItem.location.longitude}
            latitude={currentItem.location.latitude}
            offsetTop={-2}
            offsetLeft={-2}>
            <Selected size={marker_size} />
          </Marker>
        </Map>
      }
    </div>

    let web = <Profile leftPanel={profile} rightPanel={map} />
    
    let mobile = <div>
      { profile }
      { map }
    </div>

    
    return (
      <div className="Details">
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
  name: state.name,
  loading: state.places.loading,
});

export default connect(mapStateToProps)(withRouter(Details));
