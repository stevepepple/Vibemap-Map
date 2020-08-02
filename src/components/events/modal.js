import React, { Component } from 'react';
import { Button, Header, Modal, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

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
        if (props.data == null) {
            return false;
        }
    }

    render() {

        if (this.props.data == null) { return null }

        console.log('Modal props: ', this.props.data)
        let content = this.props.data.properties
        let date = dayjs(content.date)
        let categories = content.categories.map((category) => <span className={'pink image label ' + category}>{category}</span>);
        console.log('categories: ', categories)


        return (
            <Modal
                open={this.state.show}
                onClose={this.handleClose}
                closeIcon
            >
                <Modal.Header>{date.format('dddd')} {content.start_time} - {content.venue}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>{content.title}</Header>
                        {categories}

                        <Image size='medium' src={content.image} />

                        <p>{content.description}</p>
                        <a className='ui button primary' href={content.link} target='_blank'> Check it out</a>
                        <p className='small'>Event from {content.source}</p>
                        
                        <h3>Getting There</h3>
                        <p>This place is nearby and easy to get to. Click here for directions.</p>
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