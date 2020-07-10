import React from 'react'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

import ShowMoreText from 'react-show-more-text'


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
  if (tips.length > 0) top_tip = tips[0]

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
              <Label basic>Vibes:</Label>
              { vibes.length > 0 ? vibes : 'Add the first vibe...'}
            </Segment>
            <Segment vertical>
              <ShowMoreText
                /* Default options */
                lines={4}
                more='Show more'
                less='Show less'
                expanded={false}
              >
                {description ? unescape(description) : 'No description'}
              </ShowMoreText>

            </Segment>
            <Segment vertical>
              <Label basic>Activities</Label>
              {categories ? categories : 'No categories'}
            </Segment>
            <Segment vertical>
              <Label basic>Highlight</Label>
              {top_tip ? top_tip : 'Add the first tip...'}
            </Segment>
          </div>
        )
    }
  </div>
}

export default Vibe