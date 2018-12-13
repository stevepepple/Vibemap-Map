import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Navigation extends Component {
    constructor(props) {
        super(props);



    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {

    }

    componentWillUpdate(nextProps, nextState) {

    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div>
                <div className='navigation'>
                    <h3>Happening Near You</h3>
                    <LocationSearch/>
                </div>
            </div>
        );
    }
}

Navigation.propTypes = {

};

export default Navigation;