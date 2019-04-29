import React, { Component } from 'react'
import { Image, Item, Placeholder, Segment, Transition} from 'semantic-ui-react'

class PlaceNearby extends Component {

        constructor(props) {
        super(props);

        // Helper function searchFoursquare provides the data.
        this.state = {
            result: null,
            timedOut: false
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ result: newProps.result })
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

export default PlaceNearby;