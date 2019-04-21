import React, { Component } from 'react'
import { Image, Item, Placeholder, Segment, Transition} from 'semantic-ui-react'

import helpers from '../../helpers.js'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions';

class PlaceNearby extends Component {

        constructor(props) {
        super(props);

        // Helper function searchFoursquare provides the data.
        this.state = {
            result: null,
            timedOut: false
        }
    }

    componentWillMount(){
        console.log('PlaceNearby recieved prop', this.props)

        // First place
        let category = this.props.category;
        // Morning food breakfast coffee
        // Evening
        let query = 'happy hour' //art, fun, bar, food, scenic, community
        helpers.searchFoursquare(query, this.props.lat.toString() + ',' + this.props.lon.toString())
            .catch((err) => console.log(err))
            .then((results) => this.setTopandNearBy(results))
            //Set State then, get top
            .then((result) => this.setState({ result: result }))
    }

    componentWillReceiveProps(newProps) {
 
    }

    setTopandNearBy(results) {

        if (results.response.groups) {
            let places = results.response.groups[0].items

            helpers.topFoursquareResult(results)
                .then((places) => {
                    console.log("All place details: ", typeof places, places.length, places)

                    this.props.setNearbyPlaces(places)

                    //this.props.setNearbyPlaces(results)
                    /* TODO: this can be cleaner 
                    results.forEach(places => {
                        
                    });
                    result.likes = 10;
                    this.setState({ result: result })
                    places.push(this.state.result)
                    */

                })

            
        }
    }

    render() {

        if (this.state.result == null) {
            return (
                <Segment>
                    <Placeholder>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                        <Placeholder.Paragraph>
                            <Placeholder.Line length='medium' />
                            <Placeholder.Line length='short' />
                        </Placeholder.Paragraph>
                    </Placeholder>
                </Segment>         
            )
        }

        // TODO: move to helper
        let image = ""
        if (this.state.result.photos.count > 0) {
            image = this.state.result.image;
            //image = image.prefix + '200x200' + image.suffix
        }

        let hours = null;

        if (typeof this.state.result.hours != 'undefined' && typeof this.state.result.hours.richStatus != 'undefined') {
            hours = this.state.result.hours.richStatus.text;   
        }

        let tip = ''
        if (this.state.result.stats.tipCount > 0) {
            tip = this.state.result.tips.groups[0].items[0].text
        } else {
            tip = 'No tip for this places'
        }
        /*
        let icon = this.state.result.categories[0].icon;
        icon = icon.prefix + icon.suffix; 
        */


        return (

            <Segment className='nearby_place'>
                <Transition.Group animation='fade up' duration='200'>
                    <Item>
                        <Item.Image size='tiny' src={image} />

                        <Item.Content>
                            <Item.Header as='a'>{this.state.result.name}</Item.Header>
                            <Item.Meta>{tip}</Item.Meta>
                            <Item.Extra>{hours}</Item.Extra>
                        </Item.Content>
                    </Item>
                </Transition.Group>
            </Segment>
            
        );
    }
}

const mapStateToProps = state => {
    return {
        nearby_places: state.nearby_places
    }
};

export default connect(mapStateToProps, actions)(PlaceNearby);