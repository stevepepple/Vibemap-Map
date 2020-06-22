import React, { Component } from "react";

import { Grid, Message, Segment } from 'semantic-ui-react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

import isEqual from 'react-fast-compare'

import VibeMap from '../../services/VibeMap.js'

import PlaceSearch from '../places/PlaceSearch'
import PlaceForm from '../places/PlaceForm'

class ProfileLookUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            noResults: false,
            place_looked_up: false,
            placeholder: "Loading"
        }
    }

    componentDidMount() {
    
    }

    componentDidUpdate(prevProps, prevState) {

        if (!isEqual(prevProps.detailsId, this.props.detailsId)) {        
            this.getPlaceDetails()
        }
    }

    getPlaceDetails = function () {
        VibeMap.getPlaceDetails(this.props.detailsId, this.props.detailsType)
            .then(result => {
                console.log("PLACE DETAILS: ", result)

                // Handle Error
                if (result.data.detail === 'Not found.') {
                    this.setState({ details_data: null, loading: false, noResults: true })
                } else {
                    this.setState({ details_data: result.data, loading: false })
                    let point = result.data.geometry.coordinates
                    let location = { latitude: point[1], longitude: point[0] }

                    this.props.setCurrentPlace({
                        name: result.data.properties.name,
                        description: result.data.properties.description,
                        categories: result.data.properties.categories,
                        location: location,
                        images: result.data.properties.images,
                        vibes: result.data.properties.vibes,
                    })                    
                }
            })
    }

    render() {
        return (
            <Grid columns='equal' style={{ paddingTop: '8%'}}>
                <Grid.Column>
                    <Segment basic></Segment>
                </Grid.Column>
                <Grid.Column width={10}>
                    <Segment padded>
                        <h1>Your profile is waiting.</h1>
                        <p>VibeMap connects businesses to people searching for you.</p>
                        <p>We are offering places and events the ability to enhance their profile on VibeMap to ensure that their story is being told the way they want it to be told. </p>

                        <PlaceSearch />
                        
                        {this.state.noResults && 
                            <Message
                                onDismiss={this.handleDismiss}
                                header='Place is not on VibeMap yet.'
                                content="Let's add it now!"
                            />
                        }

                        {(this.props.detailsShown || this.state.noResults) &&                            
                            <PlaceForm />
                        }                    

                    </Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment basic></Segment>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = state => {

    return {
        currentPlace: state.currentPlace,
        detailsId: state.detailsId,
        detailsType: state.detailsType,
        detailsShown: state.detailsShown
    }
}

export default connect(mapStateToProps, actions)(ProfileLookUp)