import React, {PureComponent} from 'react'
import SVG from 'react-inlinesvg'

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {

    return <div id='selected_marker'>        
        <SVG 
          style={{
            height: this.props.size + 'em',
            marginLeft: '-' + this.props.size / 2 + 'em',
            marginTop: '-' + this.props.size / 2 + 'em',
            width: this.props.size + 'em'
          }}
          src={'/images/selected.svg'} />
    </div>

  }
}