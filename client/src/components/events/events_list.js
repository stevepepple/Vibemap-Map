import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Dimmer, GridColumn, Icon, Item, Loader, Segment, Tab } from 'semantic-ui-react'
import { Global, css } from '@emotion/core'

import ListItem from './list_item.js'
import * as Constants from '../../constants.js'
import TimeAndTemp from '../weather/timeAndTemp'

class EventsList extends Component {

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
            items = this.props.data.map((event) => <ListItem key={event._id} id={event._id} link={event.properties.link} onclick={this.props.onclick} content={event.properties} />);
        } else {
            return <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
        }

        return (
            <Segment>
                <Global
                    styles={{
                        '.listType' : {
                            marginLeft: '2% !important',
                            width: '98%'
                        },
                        '.ui.inverted.purple .button': {
                            color: Constants.PURPLE + '!important',
                        },
                        '.ui.inverted.purple.buttons .active.button': {
                            backgroundColor: Constants.PURPLE + '!important',
                            color: '#FFFFFF !important'
                        }
                    }}
                />

                <TimeAndTemp />

                <Button.Group className='listType' inverted onClick={this.handleButton} > {/* Was color='purple' */}
                    <Button value='events' active><Icon name='calendar' />Events</Button>
                    <Button value='attractions'><Icon name='world' />Local Attractions</Button>
                    <Button><Icon name='gem' />Hidden Gems</Button>
                </Button.Group>

                <Item.Group divided relaxed className='events_list'>
                    {items}
                </Item.Group>
            </Segment>
        );
    }
}

EventsList.propTypes = {
    data: PropTypes.array,
    onclick: PropTypes.func
};

export default EventsList;