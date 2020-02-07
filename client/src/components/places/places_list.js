import React, { Component } from 'react'
import _ from 'lodash'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'
import { store } from '../../redux/store'

import { Container, Dimmer, Form, Input, Item, Loader, Segment, Dropdown } from 'semantic-ui-react'
import { Global, css } from '@emotion/core'

import helpers from '../../helpers.js'

import ListItem from './list_item.js'
import * as Constants from '../../constants.js'
import TimeAndTemp from '../weather/timeAndTemp'

class PlacesList extends Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)

        this.state = {
            place_type_options: [
                { key: 'both', value: 'both', text: 'Places & Events' },
                { key: 'places', value: 'places', text: 'Places' },
                { key: 'events', value: 'events', text: 'Events' }
            ]
        }
    }

    onChange = (e, { value }) => {
        this.props.setSearchTerm(value)
    }

    handlePlaceType = (e, { value }) => {
        console.log("UPDATING PLACE TYPE", value)
        this.props.setPlaceType(value)
    }

    handleActivityChange = (event, { value }) => {
        this.setState({ current_activity: value })
        this.props.setActivity(value)
    }

    onClick = (event, id, type) => {
        console.log("GETTING DETAILS FOR : ", id, type)
        this.props.setDetailsId(id)
        this.props.setDetailsType(type)
        this.props.setDetailsShown(true)
    }

    render() {
        let has_items = this.props.data.length > 0;
        let top_item = null;
        let items = null;

        let searchTerm = this.props.searchTerm

        if (has_items) {
            // TODO: @cory, sorting should happen on the server. 
            // And we should be able to sort by distance, relevance, tc. 
            let sorted = this.props.data.sort((a, b) => (a.properties.score > b.properties.score) ? -1 : 1)
            items = sorted.map((place) => {
                // ID
                // Link
                // onClick
                // Properies
                return <ListItem key={place.id} id={place.id} type={place.properties.place_type} link={place.properties.url} onClick={this.onClick} properties={place.properties} />
            })
            
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
                
                <Segment vertical>
                    <Form>
                        <Form.Field widths='equal'>
                            <Input
                                fluid
                                placeholder='Search...'
                                icon='search'
                                iconPosition='left'
                                onChange={_.debounce(this.onChange, 500, {
                                    leading: true,
                                })}
                                value={searchTerm} />
                        </Form.Field>
                        <Form.Field widths='equal'>
                            <Dropdown
                                search
                                placeholder='Pick Activity'
                                selection
                                onChange={this.handleActivityChange}
                                options={Constants.activty_categories}
                                value={this.props.activity}
                            />
                        </Form.Field>
                        <Form.Group widths='equal'>                            
                            <Dropdown                                
                                icon='map pin'
                                labeled
                                fluid
                                button
                                compact
                                className='icon small'
                                onChange={this.handlePlaceType}
                                options={this.state.place_type_options}
                                value={this.props.placeType}
                            />
                            <Dropdown
                                text='Filters...'
                                icon='filter'
                                fluid
                                labeled
                                button
                                compact
                                className='icon small'
                            />
                        </Form.Group>
                    </Form>
                </Segment>
                
                
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
        activity: state.activity,
        searchTerm: state.searchTerm,
        detailsId: state.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown,
        placeType: state.placeType
    }
}

export default connect(mapStateToProps, actions)(PlacesList)