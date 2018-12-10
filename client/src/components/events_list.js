import React, { Component } from 'react';
import { Grid, Dimmer, Dropdown, GridColumn, Loader, Segment, Tab } from 'semantic-ui-react'
import PropTypes from 'prop-types';

import EventCard from './event_card.js'

class EventsList extends Component {
    render() {

        let has_items = this.props.data.length > 0;
        let top_item = null;
        let items = null;

        if (has_items) {
            //TODO: this is problematic if the user re-renders the page. 
            top_item = this.props.data.shift();

            items = this.props.data.map((event) => <Grid.Column><EventCard link={event.properties.link} content={event.properties} /></Grid.Column>);
        }

        return (
            <div className='content'>

                {has_items ? (
                    <Grid stackable columns={2}>
                        <Grid.Row>
                            <EventCard link={top_item.properties.link} content={top_item.properties} />
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
    data: PropTypes.array.isRequired
};

export default EventsList;