import React, { Component } from 'react';
import { Grid, Dimmer, Dropdown, GridColumn, Loader, Segment, Tab } from 'semantic-ui-react'
import PropTypes from 'prop-types';

import Card from './item_card.js'

class PlaceCards extends Component {

    constructor(props) {
        super(props);

        this.state = {
            top_item: null
        }
        
    }

    render() {

        let has_items = this.props.data.length > 0;
        let top_item = this.state.top_event;
        let items = [];
        
        if (has_items) {
            if (top_item == null) {
                top_item = this.props.data.shift();
                this.setState({ top_event : top_item });
            }

            items = this.props.data.map((event) => <Grid.Column><Card key={event._id} id={event._id} link={event.properties.link} content={event.properties} onclick={this.props.onclick} /></Grid.Column>);
        }

        return (
            <div>

                {has_items ? (
                    <Grid stackable columns={2}>
                        <Grid.Row>
                            <Card key={top_item._id} id={top_item._id} link={top_event.properties.link} content={top_event.properties} onclick={this.props.onclick} />
                        </Grid.Row>
                        <Grid.Row>
                            {items}
                        </Grid.Row>
                    </Grid>
                ) : (
                    <Dimmer active inverted>
                        <Loader inverted>
                        <h3>Have you ever stopped to smell the roses near Grand Avenue?</h3>
                        </Loader>
                    </Dimmer>
                    )}
            </div>
        );
    }
}

export default PlaceCards;