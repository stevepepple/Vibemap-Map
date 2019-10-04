import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Grid, Dimmer, GridColumn, Icon, List, Loader, Segment, Tab } from 'semantic-ui-react'
import { Global, css } from '@emotion/core'

import MobileListItem from './mobile_list_item.js'
import * as Constants from '../../constants.js'

class MobileList extends Component {

    constructor(props) {
        super(props);
        //this.showDetails = this.showDetails.bind(this);
    }

    // Pass the list tyep via button.
    handleButton = (e) => {
        let type = e.target.getAttribute('value')
        this.props.handleListType(type)
    }

    render() {

        let has_items = this.props.data.length > 0;
        let top_item = null;
        let items = null;

        if (has_items) {
            items = this.props.data.map((event) => {
                return <MobileListItem key={event.id} id={event.id} link={event.properties.link} onclick={this.props.onclick} content={event.properties} />
            })
            
        } else {
            return <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
        }

        return (
            <Segment>
                <Global
                    styles={{
                        '.listContainer' : {
                            position: 'absolute',
                            bottom: '20px',
                            height: '180px',
                            width: '92%',
                            overflowY: 'hidden',
                            overflowX: 'scroll'
                        },
                        '.mobileList' : {
                            background: '#FFFFFF',
                            minWidth: '12000px',
                            width: 'auto'
                        }
                    }}
                />
                <div className='listContainer'>
                    <List horizontal className='mobileList'>
                        {items}
                    </List>
                </div>
                
            </Segment>
        );
    }
}


export default MobileList;