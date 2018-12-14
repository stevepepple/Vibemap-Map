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
                {this.props.isMobile? (
                    <div className='navigation mobile'>
                        <h3 className="header">Happening Near You</h3>
                        <LocationSearchInput className='mobile search' setPosition={this.props.setPosition} />
                    </div>

                ) : (

                    <div className='navigation'>
                        <Grid stackable verticalAlign='middle'>
                            <Grid.Column width={5}>
                                <h3 className="header">Happening Near You</h3>
                            </Grid.Column>
                            <Grid.Column width={3}>
                            <LocationSearchInput setPosition={this.props.setPosition} />
                            </Grid.Column>
                        </Grid>
                    </div >
                )}


            </div>
        );
    }
}

Navigation.propTypes = {
    setPosition: PropTypes.function,
    isMobile : PropTypes.bool
};

export default Navigation;