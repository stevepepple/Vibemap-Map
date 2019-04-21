import React, { Component } from 'react'
import { Button, Grid, Dimmer, GridColumn, Icon, Item, Loader, Segment, Tab } from 'semantic-ui-react'
import PropTypes from 'prop-types'

import { Global, css } from '@emotion/core'

import ListItem from './list_item.js'
import * as Constants from '../../constants.js'


class EventsList extends Component {
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
                        '.ui.inverted.purple .button': {
                            color: Constants.PURPLE + '!important',
                        },
                        '.ui.inverted.purple.buttons .active.button' : {
                            backgroundColor: Constants.PURPLE + '!important',
                            color: '#FFFFFF !important'
                        }
                    }}
                />
                <Button.Group inverted > {/* Was color='purple' */}
                    <Button active ><Icon name='calendar'/>Events</Button>
                    <Button><Icon name='world'/>Destinations</Button>
                    <Button><Icon name='gem'/>Hidden Gems</Button>
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