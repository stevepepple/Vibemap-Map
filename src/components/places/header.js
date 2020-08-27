import React, { Fragment } from 'react'
import { withTranslation } from 'react-i18next'

import { Image, Placeholder } from 'semantic-ui-react'

const Header = (props) => {
    const { loading, currentItem, recommendation, t } = props

    const { short_description, subcategories } = props.currentItem
  
    return <div>

        {loading ? (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line length='very short' />
                    <Placeholder.Line length='medium' />
                </Placeholder.Header>
            </Placeholder>
        ) : (
            <div className='name'>
                <h2>{currentItem.name}</h2>
                {recommendation &&
                    <div className='recommendation'>
                        <span className='score'>{recommendation.score}</span>
                        <span className='reason'>{t(recommendation.reason)}</span>
                    </div>
                }

                {short_description 
                    ? <span className='category'>{short_description}</span> 
                    : subcategories && subcategories.length > 0
                        ? <span className='category'>{subcategories[0]}</span>
                        : <span className='category'>{t('None')}</span>
                }
            </div>

        )}



    </div>
}

Header.defaultProps = {
    showRecommendation: true
}

export default withTranslation()(Header)