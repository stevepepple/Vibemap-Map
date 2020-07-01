import React, { Component} from 'react'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

import { MediaMatcher } from 'react-media-match';
import { withRouter } from "react-router";

import SEO from '../components/seo/'

import Vibe from '../components/places/vibe'
import Plan from '../components/places/plan'

import {
  BrowserRouter as Router,
  useParams
} from 'react-router-dom'

import { connect } from "react-redux"
import { detailsRequest, detailsReceived, detailsError, fetchDetails } from '../redux/actions'

class Details extends Component {

    constructor(props) {
    super(props)

    this.state =  {
      id: null,
      vibes: [],
      vibes_expanded: false,
      vibes_to_show: 8,
    }

  }

  static initialAction() {
    return fetchDetails();
  }

  // Example hook
  getParams() {
    let params = useParams()
  }

  componentDidMount() {
      const id = this.props.match.params.id;
      this.setState({id : id})

      const { loaded_place, details } = this.props

      // TODO: Pattern for if data is loaded or errored out
      if (!this.props.details) {
        let type = 'places'
        this.props.dispatch(fetchDetails(id, type))
      } 
  }

  render() {

    const { loading, currentItem } = this.props

    const { vibes_expanded, vibes_to_show } = this.state

    //console.log('getParams: ', this.getParams())

    let mobile = <p>Mobile here. The document is less than 600px wide.</p>


    if (loading === false && currentItem == null) { return 'No data for the component.' }

    let web = <div>
      <p>Desktop layout here. The document is great than 600px wide.</p>
      <Vibe loading={loading} currentItem={currentItem} vibes_expanded={vibes_expanded}/>
      <Plan loading={loading} currentItem={currentItem}/>
    </div>
    
    return (
      <div className="Details">
        <SEO 
          title={currentItem.name}
          description={currentItem.description}
        />
        {loading ? (
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length='very short' />
              <Placeholder.Line length='medium' />
            </Placeholder.Header>
          </Placeholder>
        ) : (
          <h2>{currentItem.title}</h2>
        )}

        <p> Id is: {this.state.id}, {loading}</p>

        <MediaMatcher 
          desktop={web}
          mobile={mobile} />
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentItem: state.placesReducer.currentItem,
  details: state.details,
  loading: state.loading,
  name: state.name,
  loading: state.placesReducer.loading,
});

export default connect(mapStateToProps)(withRouter(Details));
