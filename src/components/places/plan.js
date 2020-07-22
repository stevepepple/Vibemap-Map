import React from 'react'
import { withTranslation } from 'react-i18next';

import { Placeholder, Label, Segment } from 'semantic-ui-react'

const Plan = (props) => {
  
  const { t } = props
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
              <Label basic>{t('Hours')}</Label>
              {hours ? hours : t('No hours')}
            </Segment>
            <Segment vertical>
              <Label basic>{t('Location')}</Label>
              {address ? address : t('No location')}
            </Segment>
            <Segment vertical>
              <Label basic>{t('Web & Social')}</Label>
              {url ? url : t('No website')}
            </Segment>
          </div>
        )
    }
  </div>
}

export default withTranslation()(Plan)