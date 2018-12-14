import React, { Component } from 'react';
import PropTypes from 'prop-types';

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

        console.log('Details props: ', this.props.data)
        let content = this.props.data.properties;

        return (
            <div>
                Event Details will go here.
            </div>
        );
    }
}

EventDetails.propTypes = {
    data: PropTypes.object
};

export default EventDetails;