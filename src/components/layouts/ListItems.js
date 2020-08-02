import React from 'react'

import helpers from '../../helpers';

import { Item } from 'semantic-ui-react'

import PlaceCard from '../elements/PlaceCard'
import CardEventLayout from '../elements/EventCard'

class ListItem extends React.Component {

    handleHover(props) {
        // TODO: why is this not working
        helpers.fireEvent(props.id, "mouseover")
    }

    onMouseLeave(id) {
        helpers.fireEvent(this.props.id, "mouseleave")
    }

    render() {
        let { id, index, properties, max, type } = this.props

        let place_type = properties.place_type

        let card_layout = null

        if (place_type === 'events') {
            card_layout = <CardEventLayout properties={properties} index={index} max={max} />
        } else {
            card_layout = <PlaceCard properties={properties} index={index} max={max} />
        }
        
        /* TODO: Can this be made an abtract component for other types of data, i.e. places */
        return (
            
            <Item 
                key={id}
                data-id={id}    
                onClick={((e) => this.props.onClick(e, id, type))} 
                onMouseOver={this.handleHover.bind(this, this.props)} 
                onMouseLeave={this.onMouseLeave.bind(this, id)}>

                {/* Events & Places have slightly different layouts */}
                {card_layout}
                
            </Item>   
        );
    }
}

export default ListItem;