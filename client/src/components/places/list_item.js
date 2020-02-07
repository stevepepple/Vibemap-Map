import React, { Component, Fragment } from 'react'

import PropTypes from 'prop-types';
import moment from 'moment';
import helpers from '../../helpers';

import { Item, Label } from 'semantic-ui-react'

import CardPlaceLayout from './card_place_layout'
import CardEventLayout from './card_event_layout'

class ListItem extends React.Component {

    handleHover(props) {
        // TODO: why is this not working
        helpers.fireEvent(props.id, "mouseover")
    }

    onMouseLeave(id) {
        helpers.fireEvent(this.props.id, "mouseleave")
    }

    render() {
        let content = this.props.properties

        console.log('THIS TYPE: ', this.props.type)

        let place_type = content.place_type

        let card_layout = null

        if (place_type === 'events') {
            card_layout = <CardEventLayout properties={this.props.properties} />
        } else {
            card_layout = <CardPlaceLayout properties={this.props.properties}/>
        }
        
        /* TODO: Can this be made an abtract component for other types of data, i.e. places */
        return (
            
            <Item 
                key={this.props.id}
                data-id={content.id}    
                onClick={((e) => this.props.onClick(e, this.props.id, this.props.type))} 
                onMouseOver={this.handleHover.bind(this, this.props)} 
                onMouseLeave={this.onMouseLeave.bind(this, this.props.id)}>

                {/* Events & Places have slightly different layouts */}
                {card_layout}
                
            </Item>   
        );
    }
}

export default ListItem;