import React, { Component } from 'react';
import { Button, Header, Modal, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import querystring from 'querystring';
import moment from 'moment';

class EventModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.show,
            directions: null
        }

        this.handleClose = this.handleClose.bind(this);
    }

    handleClose = function() {
        this.setState({ show : false})
        // Do something
    }

    componentDidUpdate = function() {
        //console.log(this.state)
    }

    componentWillReceiveProps = function(props) {
        this.setState({ show: props.show })

        // Compose Directions Link
        // API instructions are here: https://citymapper.com/tools/1053/launch-citymapper-for-directions
        let content = props.data.properties;
        let api = 'https://citymapper.com/directions/'
        let lon = props.data.geometry.coordinates[0];
        let lat = props.data.geometry.coordinates[1];        
        
        let query = querystring.stringify({
            arriveby: content.date,
            endcoord: lat + ',' + lon,
            startaddress: content.address,
            endname: content.venue,
            set_region : 'us-sf',
        });

        let url = api + '?' + query;
        this.setState({ directions : url })
    }

    render() {

        if (this.props.data == null) { return null }

        let content = this.props.data.properties;

        /*
        let categories = this.props.content.categories.map((category) => <span class={category}>Category</span>);
        let date = moment(this.props.content.date)
        let start = this.props.content.start_time
        let title = this.props.content.title;

        // TODO: Move to server side
        if (title) {
            title = title.split(' | ')
            title = title[0]            
        }
        */

        return (
            <Modal
                open={this.state.show}
                onClose={this.handleClose}
                closeIcon
            >
                <Modal.Header>Event Details</Modal.Header>
                <Modal.Content image>
                    <Image wrapped size='medium' src='/images/avatar/large/rachel.png' />
                    <Modal.Description>
                        <Header>{content.title}</Header>
                        <p>We've found the following gravatar image associated with your e-mail address.</p>
                        <p>Is it okay to use this photo?</p>


                        <a className='ui button primary' href={this.state.directions} target='_blank'> Get Directions</a>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
            
        );
    }
}

EventModal.propTypes = {
    data: PropTypes.object,
    show: PropTypes.bool
};

export default EventModal;