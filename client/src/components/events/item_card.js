import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import moment from 'moment';
const descriptionStyle = {
    position: 'relative',
    height: '6.6em', /* exactly three lines */
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

class EventCard extends Component {
    render() {

        let categories = this.props.content.categories.map((category) => <span class={category}>Category</span>);
        let date = moment(this.props.content.date)
        let start = this.props.content.start_time
        let title = this.props.content.title;
        // TODO: Move to server side
        if (title) {
            title = title.split(' | ')
            title = title[0]            
        }

        return (
            <div>
                <Card fluid>
                    <Image src={this.props.content.image} />
                    <Card.Content>
                        <Card.Header><a href={this.props.link}>{title}</a></Card.Header>
                        <Card.Meta>
                            <span className='date'>{date.format('dddd')} {start}</span>
                        </Card.Meta>
                        <Card.Description style={descriptionStyle}>{this.props.content.description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <a>
                            <Icon name='user' />
                            {this.props.content.likes} People
                        </a>
                    </Card.Content>
                </Card>
            </div>
        );
    }
}

EventCard.propTypes = {
    content: PropTypes.object.isRequired
};

export default EventCard;