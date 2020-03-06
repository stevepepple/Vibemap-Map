import React, { Component } from 'react'
import _ from 'lodash'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import helpers from '../../helpers';

import { Dimmer, Form, Input, Item, Loader, Segment, Dropdown } from 'semantic-ui-react'
import { Global } from '@emotion/core'

import ListItem from './list_item.js'
import * as Constants from '../../constants.js'
import TimeAndTemp from '../weather/timeAndTemp'

import { Translation } from 'react-i18next'

class PlacesList extends Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)

        this.state = {
            place_type_options: [
                { key: 'both', value: 'both', text: 'Everything' },
                { key: 'places', value: 'places', text: 'Places' },
                { key: 'events', value: 'events', text: 'Events' }
            ]
        }
    }    

    onChange = (e, { value }) => {
        this.props.setSearchTerm(value)
    }

    handlePlaceType = (e, { value }) => {
        console.log("CHANGED PLACE TYPE: ", value)
        this.props.setPlaceType(value)
    }

    handleActivityChange = (event, { value }) => {
        console.log("CHANGED ACTIVITY: ", value)
        this.setState({ current_activity: value })
        this.props.setActivity(value)
    }

    onClick = (event, id, type) => {        
        this.props.setDetailsId(id)
        this.props.setDetailsType(type)
        this.props.setDetailsShown(true)
    }

    render() {
        let has_items = this.props.data.length > 0;        
        let items = null;

        let searchTerm = this.props.searchTerm

        if (has_items) {
            // TODO: @cory, sorting should happen on the server. 
            let max = helpers.getMax(this.props.data, 'score')
            items = this.props.data.map((place, index) => {                                
                return <ListItem key={place.id} id={place.id} type={place.properties.place_type} link={place.properties.url} onClick={this.onClick} properties={place.properties} index={index} max={max}/>
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
                            <Translation>{
                                (t, { i18n }) => <Input
                                        fluid
                                        placeholder={t('Search')}
                                        icon='search'
                                        iconPosition='left'
                                        onChange={_.debounce(this.onChange, 500, {
                                            leading: true,
                                        })}
                                        value={searchTerm} />                                
                            }</Translation>
                            
                        </Form.Field>
                        <Form.Field widths='equal'>
                            <Translation>{
                                (t, { i18n }) => <Dropdown
                                    search
                                    placeholder={t('Pick Activity')}
                                    selection
                                    onChange={this.handleActivityChange}
                                    options={Constants.activty_categories}
                                    value={this.props.activity}
                                />
                            }</Translation>
                            
                        </Form.Field>
                        <Form.Group widths='equal'>                                                        
                            <Translation>{
                                (t, { i18n }) => <Dropdown 
                                icon='map pin'
                                labeled
                                fluid
                                button
                                compact
                                className='icon small'                                
                                text={t(this.props.placeType)}
                                value={this.props.placeType}
                                    onChange={this.handlePlaceType}
                            >
                                <Dropdown.Menu>
                                    {this.state.place_type_options.map((option) => (
                                        <Dropdown.Item key={option.value} onClick={this.handlePlaceType} text={t(option.text)} value={option.value} />
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            }</Translation>

                            <Translation>{
                            (t, { i18n }) => 
                                <Dropdown
                                    text={t('Filters')}
                                    icon='filter'
                                    fluid
                                    labeled
                                    button
                                    compact
                                    className='icon small'
                                />
                            }</Translation>
                            
                        </Form.Group>
                    </Form>
                </Segment>                
                
                {has_items? (
                    <Item.Group divided relaxed size='small' className='events_list'>
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