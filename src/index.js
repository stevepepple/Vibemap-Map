import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { store } from './redux/store'

import Map from './components/map'
import Source from './components/source'
import Layer from './components/layer'
import { Button, Checkbox, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

import Styles from './styles/map_styles.js'

class Application extends React.Component {

  // Todo map this same state to the redux store so it can be updated and propogated across the app.
  constructor(props) {
    super(props);
    this.state = {
      places_data: null,
      events_data: null,
      places: {
        isLayerChecked: true
      },
      events: {
        isLayerChecked: true
      },
      clusters: {
        isLayerChecked: false
      },
      sidebar_visible: true
    }
  }

  componentDidMount() {
    // Load places data to state
    fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/230399/oakland_places.geojson')
      .then(response => response.json())
      .then(data => this.setState({ places_data: data }))

    fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/230399/oakland_events_october.geojson')
      .then(response => response.json())
      .then(data => this.setState({ events_data: data }))
  }

  handleCheckbox = (el, event) => {
    console.log("Checkbox changed: ", event)
    this.setState({
      [event.value]: {
        isLayerChecked: event.checked
      }
    })
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <Map>
            <Source id='places' data={this.state.places_data} layer='places'>
              <Layer
                  id='places'
                  type='circle'
                  paint={Styles.places_circle}
                  isLayerChecked={this.state.places.isLayerChecked}
                />
            </Source>
            <Source id='events' data={this.state.events_data} layer='events'>
              <Layer
                id='events'
                type='circle'
                paint={Styles.events_circle}
                isLayerChecked={this.state.events.isLayerChecked}
              />
            </Source>
          </Map>
          // TODO: move to component and handle state with redux
          <Sidebar
            as={Menu}
            animation='overlay'
            direction='left'
            icon='labeled'
            onHide={this.handleSidebarHide}
            vertical
            width='medium'
            visible={this.state.sidebar_visible}
          >
            <Menu.Item as='places'>
              <Checkbox
                label='Show Places'
                onChange={this.handleCheckbox}
                checked={this.state.places.isLayerChecked}
                value='places'
              />
            </Menu.Item>
            <Menu.Item as='events'>
              <Checkbox
                label='Show Events'
                onChange={this.handleCheckbox}
                checked={this.state.events.isLayerChecked}
                value='events'
              />
            </Menu.Item>
            <Menu.Item as='clusters'>
              <Checkbox
                label='Show clusters'
                onChange={this.handleCheckbox}
                checked={this.state.clusters.isLayerChecked}
                value='clusters'
              />
            </Menu.Item>

            </Sidebar>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
