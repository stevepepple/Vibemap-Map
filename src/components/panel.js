import React, { Component } from 'react'
import { Button, Checkbox, Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'

let Panel = class Panel extends Component {
  state = { visible: true }

  handleHideClick = () => this.setState({ visible: false })
  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })

  componentWillMount() {
    console.log("props: ", this.props)
  }

  // this.props.callbackFromParent(listInfo)
  handleCheckbox = (el, event) => {
    console.log("Checkbox changed: ", event)
    this.props.handleLayers(event.value, event.checked)
  }

  render() {
    const { visible } = this.state

    return (
      <div>
        <Sidebar
          as={Menu}
          animation='overlay'
          direction='left'
          icon='labeled'
          onHide={this.handleSidebarHide}
          vertical
          width='thin'
          visible={this.state.visible}
        >
          <Menu.Item as='places'>
            <Checkbox
              label='Show Places'
              onChange={this.handleCheckbox}
              checked={this.props.state.places.isLayerChecked}
              value='places'
            />
          </Menu.Item>
          <Menu.Item as='events'>
            <Checkbox
              label='Show Events'
              onChange={this.handleCheckbox}
              checked={this.props.state.events.isLayerChecked}
              value='events'
            />
          </Menu.Item>
          <Menu.Item as='clusters'>
            <Checkbox
              label='Show clusters'
              onChange={this.handleCheckbox}
              checked={this.props.state.clusters.isLayerChecked}
              value='clusters'
            />
          </Menu.Item>
        </Sidebar>
      </div>
    )
  }
}

export default Panel;
