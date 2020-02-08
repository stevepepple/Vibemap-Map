import React, {PureComponent} from 'react'
import SVG from 'react-inlinesvg'

// Important for perf: the markers never change, avoid rerender when the map viewport changes
export default class Pins extends PureComponent {
  render() {

    return <div id='selected_marker'>
        <div></div>
        <SVG 
          style={{
            height: '3em',
            marginLeft: '-1em',
            marginTop: '-1em',
            width: '3em'        
          }}
          src={process.env.PUBLIC_URL + '/images/selected.svg'} />
    </div>

  }
}