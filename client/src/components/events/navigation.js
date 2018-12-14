import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react'

import PropTypes from 'prop-types';

import LocationSearchInput from '../map/search'

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
                    <Grid>
                        <Grid.Column width={3}>
                            <h3 className="header">Happening Near You</h3>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <LocationSearchInput setPosition={this.props.setPosition} />
                        </Grid.Column>
                    </Grid>
                    

                </div>
            </div>
        );
    }
}

Navigation.propTypes = {
    setPosition: PropTypes.function
};

export default Navigation;