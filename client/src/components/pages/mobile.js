import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Icon } from 'semantic-ui-react'
import 'react-tabs/style/react-tabs.css';

// Components
import Navigation from '../events/navigation.js'
import EventsMap from '../events/events_map.js'
import EventsCards from '../events/events_cards.js'
import PlaceCards from '../places/place_cards.js'

class MobilePage extends Component {

    render() {
    
        return (
            <div className='mobile'>
                <Navigation days={this.props.days} vibes={this.props.vibe_categories} isMobile={this.props.isMobile} />

                <Tabs selectedTabClassName='active'>

                    <TabList className='ui menu secondary'>
                        <Tab className='item'><Icon name='map'/>Map</Tab>
                        <Tab className='item'><Icon name='list ul' />List</Tab>
                    </TabList>
                    <TabPanel>
                        <EventsMap events_data={this.props.data} places_data={this.props.places_data} setZoom={this.setZoom} lat={this.props.lat} lng={this.props.lon} zoom={this.props.zoom} distance={this.props.distance} zoom={this.props.details_shown ? 16 : this.props.zoom} setPosition={this.setPosition} onclick={this.props.showDetails} />                     
                        <PlaceCards lat={this.props.lat} lon={this.props.lon} />
                    </TabPanel>
                    <TabPanel>
                        <EventsCards data={this.props.data} onclick={this.props.showDetails} />
                        {/* <EventModal data={this.state.current_item} show={this.state.detail_shown} details={<EventDetails data={this.state.current_item_item} />} /> */}
                    </TabPanel>
                </Tabs>
                
                
            </div>
        );
    }
}

export default MobilePage;