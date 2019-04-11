import React from 'react'
import PropTypes from 'prop-types'

export default class Source extends React.Component {

  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    url: PropTypes.string,
    layer: PropTypes.string,
    children: PropTypes.node
  }

  static contextTypes = {
    map: PropTypes.object
  }

  componentWillMount() {
    const { map } = this.context
    const {
      id,
      data,
      url
    } = this.props
    map.addSource(id, { type: 'geojson', data: data })
  }

  componentWillUnmount() {
    const { map } = this.context
    const { id } = this.props

    // TODO: Diagnose a better way to check if there are already sources
    try {
      map.removeSource(id)
    } catch (error) {
      console.log('Problem removing layer source: ', error)
    }  
      
    
  }

  // Update source from props
  componentWillReceiveProps(nextProps) {
    const { map } = this.context
    map.getSource(nextProps.id).setData(nextProps.data);
  }

  render() {
    return (
      <div>
        {this.props.children &&
          React.Children.map(this.props.children, child => (
            React.cloneElement(child, {
              sourceId: this.props.id,
              sourceLayer: this.props.layer
            })
          ))
        }
      </div>
    )
  }
}
