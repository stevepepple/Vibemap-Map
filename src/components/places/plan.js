import React from 'react'
import { useSelector } from 'react-redux'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

const Plan = (props) => {
  let { categories, hours, address, url, is_closed } = props.currentItem
  console.log(props)

  if (props.currentItem.categories.length > 0) {
    categories = props.currentItem.categories.map((category) => <Label key={category} className={'image label ' + category}>{category}</Label>);
  }

  return <div>
    <h3>Plan</h3>
    {
      props.loading ? (
        <Placeholder>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder>
      ) : (
          <Segment.Group basic>
            <Segment>{ hours ? hours : 'No hours'}</Segment>
            <Segment>{ address ? address : 'No address'}</Segment>
            <Segment>{ url ? url : 'No website'}</Segment>
          </Segment.Group>
        )
    }
  </div>
}

export default Plan