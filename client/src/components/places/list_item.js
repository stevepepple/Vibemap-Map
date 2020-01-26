import React, { Component, Fragment } from 'react';
import { Item, Icon, Image, Label } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import moment from 'moment';
import helpers from '../../helpers';

class ListItem extends React.Component {

    handleHover(props) {
        // TODO: why is this not working
        helpers.fireEvent(props.id, "mouseover")
    }

    onMouseLeave(id) {
        helpers.fireEvent(this.props.id, "mouseleave")
    }

    render() {
        let content = this.props.content

        // If there's an upcoming event, make it the primary content
        if (this.props.content.hotspots_events.features.length > 0) {
            // Make sure the date is now or whatever the search range is...
            // Otherwise show upcoming events as cards
            let event = this.props.content.hotspots_events.features[0]

            // TODO: today should be what ever day & Time the users is looking for.
            let today = moment()
            let event_date = moment(event.properties.start_date)
            let diff = event_date.diff(today, 'days')
            
            if( diff === 0 || diff === 1) {
                content = event.properties
            }
            
        }
        
        let title = content.name;
        let start = content.start_time
        let date = content.start_date
        let score = Math.round(content.average_score)

        let categories = null
        
        if (typeof (content.categories) == 'object'){
            categories = content.categories.map((category) => <span class={category}>Category</span>)
        } else {
            categories = content.categories
        }
        
         
        // TODO: Move to server side
        if (title) {
            title = title.split(' | ')
            title = title[0]            
        }
        
        let vibes = null;
        if (typeof content.vibes !== "undefined") {
            let remainder = content.vibes.length - 1
            vibes = null

            if (remainder > 0) {
                vibes = <Label key={content.vibes[0]} className={'vibe label ' + content.vibes[0]}>{content.vibes[0] + ' & ' + remainder + ' more'}</Label>
            }

            if (remainder == 0) {
                vibes = <Label key={content.vibes[0]} className={'vibe label ' + content.vibes[0]}>{content.vibes[0]}</Label>
            }


            // vibes = content.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
        }
        
        /* TODO: Can this be made an abtract component for other types of data, i.e. places */
        return (
            
            <Item 
                key={this.props.id}
                data-id={content.id}    
                onClick={((e) => this.props.onClick(e, this.props.id))} 
                onMouseOver={this.handleHover.bind(this, this.props)} 
                onMouseLeave={this.onMouseLeave.bind(this, this.props.id)}>
                <Item.Image src={content.images[0]} size='small' />
                <Item.Content>
                    <Item.Extra className='date'>{date} {start}</Item.Extra>
                    <Item.Header>{title}</Item.Header>                
                    <Item.Extra>
                        <div>
                            {vibes}
                        </div>
                        <span className='venue'>{content.venue}</span>                  
                        <span className='interested'>
                            <Icon name='user' />
                            {score} VibeMap Score
                        </span>
                    </Item.Extra>
                </Item.Content>
            </Item>
            
        );
    }
}

ListItem.propTypes = {
    content: PropTypes.object.isRequired,
    id: PropTypes.string,
    link: PropTypes.string,
    onclick: PropTypes.func
};

export default ListItem;