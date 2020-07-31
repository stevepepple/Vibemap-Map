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
                <Placeholder>
                    <Placeholder.Image square />
                </Placeholder>
            </Placeholder>
        ) : (
            <div className='name'>
                <h2>{currentItem.name}</h2>

                {short_description 
                    ? <span>{short_description}</span> 
                    : subcategories && subcategories.length > 0
                        ? <span>{subcategories[0]}</span>
                        : <span>{t('None')}</span>
                }

                {recommendation && 
                    <div className='recommendation'>
                        <span className='score'>{recommendation.score}</span>
                        <span className='reason'>{t(recommendation.reason)}</span>                    
                    </div>
                }
            </div>

        )}



    </div>
}

Header.defaultProps = {
    showRecommendation: true
}

export default withTranslation()(Header)