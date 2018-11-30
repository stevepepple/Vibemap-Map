import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { store } from './redux/store'

import Map from './components/map'
import Source from './components/source'
import Layer from './components/layer'
import Panel from './components/panel'
import { Button, Checkbox, Container, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

import Styles from './styles/map_styles.js'

class Application extends React.Component {

  // Todo map this same state to the redux store so it can be updated and propogated across the app.
  constructor(props) {
    super(props);
    this.state = {
      places_data: null,
      events_data: null,
      layers: {
        places: { isLayerChecked: true },
        events: { isLayerChecked: true },
        heatmap: { isLayerChecked: true },
        clusters: { isLayerChecked: false }
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

  // Get checked state from child component
  handleLayers = (value, checked) => {
    let newState = Object.assign({}, this.state);
    newState.layers[value].isLayerChecked = checked
    this.setState(newState)
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
                  isLayerChecked={this.state.layers.places.isLayerChecked}
                />
            </Source>
            <Source id='heatmap' data={this.state.places_data} layer='places'>
              <Layer
                  id='heatmap'
                  type='heatmap'
                  paint={Styles.places_circle}
                  isLayerChecked={this.state.layers.heatmap.isLayerChecked}
                />
            </Source>
            <Source id='events' data={this.state.events_data} layer='events'>
              <Layer
                id='events'
                type='circle'
                paint={Styles.events_circle}
                isLayerChecked={this.state.layers.events.isLayerChecked}
              />
            </Source>
          </Map>
          <Panel state={this.state.layers} handleLayers={this.handleLayers}/>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
