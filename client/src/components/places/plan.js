import React from 'react'
import { useSelector } from 'react-redux'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

const Plan = (props) => {
  console.log(props)
  let categories = null

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
          <Segment.Group>
          <Segment>{categories ? categories : 'No categories'}</Segment>
          <Segment>{props.currentItem.hours ? this.props.currentItem.hours : 'No hours'}</Segment>
          <Segment>{props.currentItem.address ? this.props.currentItem.address : 'No address'}</Segment>
          <Segment>{props.currentItem.url ? this.props.currentItem.url : 'No website'}</Segment>
          </Segment.Group>
      )
    }
  </div>
}

export default Plan