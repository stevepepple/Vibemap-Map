import React from 'react'
import { useSelector } from 'react-redux'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

const Plan = (props) => {
  let { categories, hours, address, url, is_closed } = props.currentItem

  if (props.currentItem.categories.length > 0) {
    categories = props.currentItem.categories.map((category) => <Label key={category} className={'image label ' + category}>{category}</Label>);
  }

  return <div>
    {
      props.loading ? (
        <Placeholder>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder>
      ) : (
          <div>
            <Segment vertical>
              <Label basic>Hours</Label>
              { hours ? hours : 'No hours'}
            </Segment>
            <Segment vertical>
              <Label basic>Location</Label>
              { address ? address : 'No address'}
            </Segment>
            <Segment vertical>
              <Label basic>Web & Social</Label>
              { url ? url : 'No website'}
            </Segment>
          </div>
        )
    }
  </div>
}

export default Plan