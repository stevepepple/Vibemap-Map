import React, { Component } from 'react';
import { Grid, Dimmer, GridColumn, Item, Loader, Segment, Tab } from 'semantic-ui-react'
import PropTypes from 'prop-types';

import ListItem from './list_item.js'

class EventsList extends Component {
    render() {

        let has_items = this.props.data.length > 0;
        let top_item = null;
        let items = null;

        if (has_items) {
            items = this.props.data.map((event) => <ListItem key={event._id} id={event._id} link={event.properties.link} onclick={this.props.onclick} content={event.properties} />);
        } else {
            return <Dimmer active inverted><Loader inverted><h3>Have you ever stopped to smell the roses near Grand Avenue?</h3></Loader></Dimmer>
        }

        return (
            <div>
                <Grid stackable columns={2}>
                    <Grid.Row>
                        <Item.Group divided relaxed>
                            {items}
                        </Item.Group>
                    </Grid.Row>
                </Grid>
             </div>
        );
    }
}

EventsList.propTypes = {
    data: PropTypes.array,
    onclick: PropTypes.func
};

export default EventsList;