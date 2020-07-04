import React, { Component, Fragment } from 'react'
import ErrorBoundary from '../pages/GlobalError.js'

import { Button, Grid, Transition } from 'semantic-ui-react'

class TwoColumnLayout extends Component {

    constructor(props) {
        super(props)
    }

    shouldComponentUpdate() {
        return true;
    }
       
    render() {
        const { expandCollapse, leftPanel, rightPanel, showLeft } = this.props

        let { leftWidth, rightWidth } = this.props

        return(            
            <Grid id='content' className='content' padded>
                <Grid.Row className='collapsed columns' style={{ paddingLeft: '7em', paddingRight: '7em' }}>
                    <Grid.Column floated='left' width={leftWidth} className='leftPanel'>
                        <Fragment>
                            {leftPanel}
                        </Fragment>
                    </Grid.Column>
                
                    <Grid.Column width={rightWidth}>
                        <Fragment>
                            {rightPanel}
                        </Fragment>                    
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

TwoColumnLayout.defaultProps = {
    leftWidth: 9,
    rightWidth: 7,
    expandCollapse: true,
    leftPanel: <div>LeftPanel goes here</div>,
    rightPanel: <div>RightPanel goes here</div>,
    
}

export default TwoColumnLayout