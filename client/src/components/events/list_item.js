import React, { Component } from 'react';
import { Item, Icon, Image, Label } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import moment from 'moment';
import helpers from '../../helpers';

class ListItem extends React.Component {

    handleHover(props) {
        console.log("Hovering on: ", props, this.props.id)
        helpers.fireEvent(this.props.id, "focus")
    }

    onMouseLeave(id) {
        helpers.fireEvent(this.props.id, "mouseleave")
    }

    render() {
        
        let title = this.props.content.name;
        let start = this.props.content.start_time
        let date = this.props.content.start_date
        let score = Math.round(this.props.content.score)
        let categories = this.props.content.categories.map((category) => <span class={category}>Category</span>);
         
        // TODO: Move to server side
        if (title) {
            title = title.split(' | ')
            title = title[0]            
        }

        let content = this.props.content;
        
        let vibes = null;
        if (typeof content.vibes !== "undefined") {
            vibes = content.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>)
        }
        
        /* TODO: Can this be made an abtract component for other types of data, i.e. places */
        return (
            
            <Item onClick={((e) => this.props.onClick(e, this.props.id, content.type))} key={this.props.id} data-id={content.id}>
                <Item.Image src={this.props.content.images[0]} size='small' />
                <Item.Content onMouseOver={this.handleHover.bind(this, this.props)} onMouseLeave={this.onMouseLeave.bind(this, this.props.id)}>
                    <Item.Extra className='date'>{date} {start}</Item.Extra>
                    <Item.Header>{title}</Item.Header>                
                    <Item.Extra>
                        <div>
                            {vibes}
                        </div>
                        <span className='venue'>{content.venue}</span>                  
                        <span className='interested'>
                            <Icon name='user' />
                            {score} Relevance
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