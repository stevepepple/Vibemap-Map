import React, { Component } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types';

const descriptionStyle = {
    position: 'relative',
    height: '6.6em', /* exactly three lines */
    overflow: 'hidden',
    textOverflow: 'ellipsis'
};

class EventCard extends Component {
    render() {

        let categories = this.props.content.categories.map((category) => <span class={category}>Category</span>);

        return (
            <div>
                <Card fluid>
                    <Image src={this.props.content.image} />
                    <Card.Content>
                        <Card.Header>{this.props.content.title}</Card.Header>
                        <Card.Meta>
                            <span className='date'>{this.props.content.date}</span>
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