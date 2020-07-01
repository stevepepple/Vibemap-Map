import React from 'react'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

const Vibe = (props) => {
  let { vibes, description, categories, tips, vibes_expanded } = props.currentItem

  if (vibes.length > 0) {
      if (vibes_expanded === false) {
          vibes = vibes.slice(0, vibes_to_show).map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
      } else {
          vibes = vibes.map((vibe) => 
            <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
      }
  }
  
  if (props.currentItem.categories.length > 0) {
    categories = props.currentItem.categories.map((category) => <Label key={category} className={'image label ' + category}>{category}</Label>);
  }


  let top_tip = null
  if (tips.length > 0) {
    top_tip = tips[0]
  }

  return <div>
    <h3>Vibe</h3>
    {
      props.loading ? (
        <Placeholder>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder>
      ) : (
          <Segment.Group basic>
            <Segment>
              <span>The Vibe:</span>
              { vibes.length > 0 ? vibes : 'Add the first vibe...'}</Segment>
            <Segment>{ top_tip ? top_tip : 'Add the first tip...'}</Segment>
            <Segment>
              <span>Known for:</span>
              {categories ? categories : 'No categories'}</Segment>
            <Segment>{ description ? description : 'No description'}</Segment>
          </Segment.Group>
        )
    }
  </div>
}

export default Vibe