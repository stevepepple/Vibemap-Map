import React from 'react'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

const Header = (props) => {
    const { loading, currentItem } = props

    if (currentItem.reason === undefined) currentItem.reason = 'vibe'
    let reason = Constants.RECOMMENDATION_REASONS[this.props.currentItem.reason]
  
    return <div>
        {loading ? (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line length='medium' />
                </Placeholder.Header>
            </Placeholder>
        ) : (
            <List.Item className='recomendation'>
                <Icon name='heartbeat' color='green' />
                <List.Content>
                    <List.Header>{reason}</List.Header>
                </List.Content>
            </List.Item>
        )}

    </div>
}

export default Header