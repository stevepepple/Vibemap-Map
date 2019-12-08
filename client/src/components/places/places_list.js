import React, { Component } from 'react'
import _ from 'lodash'


import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import { Dimmer, Input, Item, Loader, Segment } from 'semantic-ui-react'
import { Global, css } from '@emotion/core'

import ListItem from './list_item.js'
import * as Constants from '../../constants.js'
import TimeAndTemp from '../weather/timeAndTemp'

class EventsList extends Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onChange = (e, { value }) => {
        this.props.setSearchTerm(value)
    }

    onClick = (event, id) => {
        this.props.setDetailsId(id)
        this.props.setDetailsShown(true)
    }

    render() {
        let has_items = this.props.data.length > 0;
        let top_item = null;
        let items = null;

        let searchTerm = this.props.searchTerm

        if (has_items) {
            // TODO: @cory, sorting should happen on the server. 
            let sorted = this.props.data.sort((a, b) => (a.properties.score > b.properties.score) ? -1 : 1)
            items = sorted.map((event) => {
                return <ListItem key={event.id} id={event.id} link={event.properties.link} onClick={this.onClick} content={event.properties} />
            })
            
        } else {
             
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

                <Input 
                    fluid 
                    placeholder='Search...' 
                    icon='search' 
                    iconPosition='left' 
                    onChange={_.debounce(this.onChange, 500, {
                        leading: true,
                    })} 
                    value={searchTerm} />
                
                {has_items? (
                    <Item.Group divided relaxed className='events_list'>
                        {items}
                    </Item.Group>
                ) : (
                    <Segment placeholder>
                        <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
                    </Segment>
                )}
                     
                
            </Segment>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchTerm: state.searchTerm,
        detailsId: state.detailsId,
        detailsShown: state.detailsShown
    }
}

export default connect(mapStateToProps, actions)(EventsList);