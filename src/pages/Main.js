import React, { Component, Fragment } from 'react'
import Media from 'react-media'

import { connect } from "react-redux"
import { fetchCities } from '../app/actions/actions'

import { Helmet } from 'react-helmet-async'

import './Main.scss';

class Main extends Component {

  static initialAction() {

    return fetchCities()
  }

  componentDidMount() {
    // TODO: Pattern for if data is loaded or errored out
    if (!this.props.cities) {
      this.props.dispatch(Main.initialAction())
    } 
  }

  render() {
    console.log('Main props: ', this.props)

    return (
      <div className="Main">
        <Helmet>
          <title>Vibemap</title>
          <link rel="canonical" href="https://www.tacobell.com/" />
          <meta
            name="description"
            content="Amazing Tech Talks curated by the community ❤️"
          />
        </Helmet>

        <div className="Home-header">
          <h2>Welcome to Vibemap</h2>
        </div>
        <Media query="(max-width: 599px)">
          {matches =>
            matches ? (
              <p>Mobile here. The document is less than 600px wide.</p>
            ) : (
                <p>Web here. The document is at least 600px wide.</p>
              )
          }
        </Media>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cities: state.cities
});

export default connect(mapStateToProps)(Main);
