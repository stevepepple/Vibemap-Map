import React, { Component } from 'react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { Dimmer, Input, Item, Loader, Segment } from 'semantic-ui-react'
import { Global, css } from '@emotion/core'

import ListItem from './list_item.js'
import * as Constants from '../../constants.js'
import TimeAndTemp from '../weather/timeAndTemp'

class EventsList extends Component {

    // Pass the list tyep via button.
    handleButton = (e) => {
        let type = e.target.getAttribute('value')
        
        this.props.handleListType(type)
    }

    onChange = (e, { value }) => {
        
        if (value.length > 2) {
            this.props.setSearchTerm(value)
        }
    }

    render() {

        let has_items = this.props.data.length > 0;
        let top_item = null;
        let items = null;

        if (has_items) {
            // TODO: @cory, sorting should happen on the server. 
            let sorted = this.props.data.sort((a, b) => (a.properties.score > b.properties.score) ? -1 : 1)
            items = sorted.map((event) => {
                return <ListItem key={event.id} id={event.id} link={event.properties.link} onclick={this.props.onclick} content={event.properties} />
            })
            
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

                <Input placeholder='Search...' onChange={this.onChange} />
                            
                <Item.Group divided relaxed className='events_list'>
                    {items}
                </Item.Group>
            </Segment>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchTerm: state.searchTerm
    }
}

export default connect(mapStateToProps, actions)(EventsList);