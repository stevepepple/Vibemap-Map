import React, { Component } from 'react';
import { Grid, Dimmer, Dropdown, GridColumn, Loader, Segment, Tab } from 'semantic-ui-react'
import PropTypes from 'prop-types';

import Card from './item_card.js'

class EventsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            top_event: null
        }
        
    }

    render() {

        let has_items = this.props.data.length > 0;
        let top_event = this.state.top_event;
        let items = [];
        
        if (has_items) {
            if (top_event == null) {
                top_event = this.props.data.shift();
                this.setState({ top_event : top_event });
            }

            items = this.props.data.map((event) => <Grid.Column><Card key={event._id} id={event._id} link={event.properties.link} content={event.properties} onclick={this.props.onclick} /></Grid.Column>);
        }

        return (
            <div>

                {has_items ? (
                    <Grid stackable columns={2}>
                        <Grid.Row>
                            <Card key={top_event._id} id={top_event._id} link={top_event.properties.link} content={top_event.properties} onclick={this.props.onclick} />
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

EventsList.propTypes = {
    data: PropTypes.array,
    onclick: PropTypes.func
};

export default EventsList;