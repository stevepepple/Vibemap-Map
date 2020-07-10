import React from 'react'

import { Placeholder, Label, Segment } from 'semantic-ui-react'

const Header = (props) => {
    const { loading, currentItem } = props
  
    return <div>
        {loading ? (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line length='very short' />
                    <Placeholder.Line length='medium' />
                </Placeholder.Header>
            </Placeholder>
        ) : (
            <h2>{currentItem.name}</h2>
        )}

    </div>
}

export default Header