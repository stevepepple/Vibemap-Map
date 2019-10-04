import React, { Component } from 'react';
import { Item, Icon, Image, Label, List } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import moment from 'moment';
import helpers from '../../helpers';
import { connect } from 'react-redux'


class ListItem extends React.Component {

    constructor(props) {
        super(props);
    }

    handleHover(id) {
        helpers.fireEvent(this.props.id, "focus")
    }

    onMouseLeave(id) {
        helpers.fireEvent(this.props.id, "mouseleave")
    }

    render() {
        
        let title = this.props.content.name;
        let start = this.props.content.start_time
        let date = moment(this.props.content.start_date)
        let score = Math.round(this.props.content.score)
        let categories = this.props.content.categories.map((category) => <span class={category}>Category</span>);
         

        let content = this.props.content;
        
        let vibes = null;
        if (typeof content.vibes !== "undefined") {
            vibes = content.vibes.map((vibe) => <Label key={vibe} className={'vibe label ' + vibe}>{vibe}</Label>);
        }

        let boundClick = this.props.onclick.bind(this, this.props.id);

        /* TODO: Can this be made an abtract component for other types of data, i.e. places */
        return (
            
            <List.Item className={'mobileListItem'} onClick={boundClick} key={this.props.id} data-id={content.id}>
                <Image src={this.props.content.images[0]} size='small' />
                <List.Content onMouseOver={this.handleHover.bind(this, this.props.id)} onMouseLeave={this.onMouseLeave.bind(this, this.props.id)}>
                    <List.Header textAlign='left'>{title}</List.Header>                
                    <Item.Extra>
                        <div className={date}>{date.format('dddd')} {start}</div>                        
                        <span className='venue'>{content.hotspots_place.properties.name}</span>                  

                        <div>
                            {vibes}
                        </div>
                        {/* 
                        <span className='interested'>
                            <Icon name='user' />
                            {score} Relevance
                        </span>
                        */}
                    </Item.Extra>
                </List.Content>
            </List.Item>
            
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