import React, { Component, Fragment } from 'react'
import ErrorBoundary from '../pages/GlobalError.js'

import { Button, Grid, Transition } from 'semantic-ui-react'

class TwoColumnLayout extends Component {

    constructor(props) {
        super(props)

        this.toggleList = this.toggleList.bind(this)

        // State includes some globals only for the main page; 
        // Most other UI state is managed by Redux
        this.state = {
            showLeft: this.props.showLeft
        }
    }

    shouldComponentUpdate() {
        return true;
    }
    
    toggleList() {
        this.setState({ showLeft: !this.state.showLeft})
        this.forceUpdate()
        console.log('Expand-Collapse list', this.state.showLeft)
    }
    
    render() {
        const { expandCollapse, leftPanel, rightPanel, showLeft } = this.props

        let { leftWidth, rightWidth } = this.props

        let list_arrow = 'arrow left'
        if (this.state.showLeft === false) {
            leftWidth = 1
            rightWidth = 15
            list_arrow = 'arrow right'
        }

        return(            
            <Grid id='content' className='content' padded>
                <Grid.Row className='collapsed columns' style={{ background: '#EEEEEE' }}>
                    <Transition animation='fade right' visible={showLeft} duration={200}>
                        <Grid.Column floated='left' width={leftWidth} className='list_details'>

                            {this.state.showLeft &&
                                <Fragment>
                                    {leftPanel}
                                </Fragment>
                            }
                            {/* <EventsList data={this.state.data} /> */}

                        </Grid.Column>
                    </Transition>

                    <Grid.Column width={rightWidth}>
                        {expandCollapse &&
                            <Button
                                onClick={this.toggleList.bind(this)} icon={list_arrow}
                                style={{ position: 'absolute', boxShadow: '0 0 0 1px rgba(34,36,38,.15) inset', left: '-1.1em', top: '50%', zIndex: '100' }}
                                circular />
                        }
                    
                        <ErrorBoundary>
                            {rightPanel}
                        </ErrorBoundary>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

TwoColumnLayout.defaultProps = {
    showLeft: false,
    leftWidth: 5,
    rightWidth: 11,
    expandCollapse: true,
    leftPanel: <div>LeftPanel goes here</div>,
    rightPanel: <div>RightPanel goes here</div>,
    
}

export default TwoColumnLayout