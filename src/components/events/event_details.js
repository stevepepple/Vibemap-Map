import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Header, Image, Label, Loader } from 'semantic-ui-react'
import Directions from '../places/directions'
import VibeMap from '../../services/VibeMap.js'

import dayjs from 'dayjs';

class EventDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            id: this.props.id,
            details_data: null,
            loading: true,
            directions: null
        }
    }

    handleClose = function() {
        this.setState({ show : false})
        // Do something
    }

    componentDidMount = function() {
        //console.log(this.state)
        VibeMap.getEventDetails(this.props.id)
            .then(result => this.setState({ details_data : result.data, loading : false }))
    }

    render() {
        // TODO: try this same technique in the map
        if (this.state.loading === true) { return <Loader content='Loading' /> }
        
        if (this.state.details_data == null) { return 'No data for the component.' }

        

        let content = this.state.details_data.properties;
        let date = dayjs(content.date)
        let categories = content.categories.map((category) => <Label className={'pink image label ' + category}>{category}</Label>);

        console.log(content.vibes)

        return (
            <div className='details'>
                <Button onClick={this.props.clearDetails}>Back</Button>

                <Header>{content.name}</Header>

                <p className='date'>{date.format('dddd Ha')} {content.start}</p>

                <Image size='medium' src={content.images[0]} />

                {/* TODO: Render Description at HTML the proper way as stored in Mongo and then as own React component */}
                <div className='full_description' style={{ 'height': 'auto' }} dangerouslySetInnerHTML={{ __html: content.description }}></div>

                <div>
                    {categories}
                </div>

                <h3>Details & Tickets</h3>
                <a className='ui button primary' href={content.url} target='_blank'> Check it out</a>
                <p className='small'>Event from {content.source}</p>

                <Directions data={this.state.details_data} />
            </div>
        );
    }
}

export default EventDetails;