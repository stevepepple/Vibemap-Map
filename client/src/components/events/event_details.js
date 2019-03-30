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
        console.log(props)
    }

    render() {

        if (this.props.data == null) { return 'No data for the component.' }

        let content = this.props.data.properties;
        let date = moment(content.date)
        let categories = content.categories.map((category) => <Label className={'pink image label ' + category}>{category}</Label>);

        return (
            <div className='details'>
                <Button onClick={this.props.clearDetails}>Back</Button>

                <Header>{content.title}</Header>
                {categories}

                <Image size='medium' src={content.image} />

                <p className='full_description' style={{ 'height': '18vmin'}}>{content.description}</p>
                
                <a className='ui button primary' href={content.link} target='_blank'> Check it out</a>
                <p className='small'>Event from {content.source}</p>

                <Directions data={this.props.data} />
            </div>
        );
    }
}

export default EventDetails;