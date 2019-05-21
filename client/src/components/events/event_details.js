import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Image, Label } from 'semantic-ui-react'
import Directions from '../places/directions'

import moment from 'moment';

class EventDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            directions: null
        }
    }

    handleClose = function() {
        this.setState({ show : false})
        // Do something
    }

    componentDidUpdate = function() {
        //console.log(this.state)
    }

    componentWillReceiveProps = function(props) {
    
    }

    render() {

        if (this.props.data == null) { return 'No data for the component.' }

        let content = this.props.data.properties;
        let date = moment(content.date)
        let categories = content.categories.map((category) => <Label className={'pink image label ' + category}>{category}</Label>);

        console.log(content.vibes)

        return (
            <div className='details'>
                <Button onClick={this.props.clearDetails}>Back</Button>

                <Header>{content.title}</Header>

                <p className='date'>{date.format('dddd Ha')} {content.start}</p>

                <Image size='medium' src={content.image} />

                {/* TODO: Render Description at HTML the proper way as stored in Mongo and then as own React component */}
                <div className='full_description' style={{ 'height': 'auto' }} dangerouslySetInnerHTML={{ __html: content.description }}></div>

                <div>
                    {categories}
                </div>

                <h3>Details & Tickets</h3>
                <a className='ui button primary' href={content.link} target='_blank'> Check it out</a>
                <p className='small'>Event from {content.source}</p>

                <Directions data={this.props.data} />
            </div>
        );
    }
}

export default EventDetails;