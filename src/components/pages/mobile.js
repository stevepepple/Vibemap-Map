import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Icon } from 'semantic-ui-react'
import 'react-tabs/style/react-tabs.css'

/* REDUX STUFF */
import { connect } from 'react-redux'
import * as actions from '../../redux/actions'

// Components
import Navigation from '../events/navigation.js'
import EventsMap from '../events/events_map.js'
import MobileList from '../places/mobile_list'

class Mobile extends Component {

    componentDidMount() {
        console.log("references: ", this.refs)
        console.log(this.refs.mapTab.clientHeight, this.refs.mapTab.clientWidth);
    }

    render() {
    
        return (
            <div className='mobile'>
                <Navigation days={this.props.days} vibes={this.props.vibe_categories} isMobile={this.props.isMobile} />

                <Tabs selectedTabClassName='active'>
                    <TabList className='ui menu secondary'>
                        <Tab className='item'><Icon name='map'/>Map</Tab>
                        <Tab className='item'><Icon name='list ul' />List</Tab>
                    </TabList>
                    <TabPanel ref="mapTab">

                        <div style={{ width: window.innerWidth + 'px', height: window.innerHeight - 100 + 'px' }}>
                            <EventsMap
                                searchTerm={this.props.searchTerm}
                                events_data={this.props.eventsData}
                                places_data={this.props.placesData}
                                zoom={this.props.detailsShown ? 16 : this.props.zoom}
                                setPosition={this.setPosition}                                
                                setLocationParams={this.props.setLocationParams} />
                            <MobileList data={this.props.placesData} type='places' onclick={this.props.onclick} handleListType={this.handleListType} />
                        </div>                    
                                                    
                    </TabPanel>
                    <TabPanel>
                        <MobileList data={this.props.eventsData} type='places' onclick={this.props.onclick} handleListType={this.handleListType} />
                        {/*
                        <EventsCards data={this.props.data} onclick={this.props.showDetails} />
                        <EventModal data={this.state.current_item} show={this.state.detail_shown} details={<EventDetails data={this.state.current_item_item} />} /> 
                        */}
                    </TabPanel>
                </Tabs>
                
                
            </div>
        );
    }
}

const mapStateToProps = state => ({
    geod: state.geod,
    currentCategory: state.currentCategory,
    currentLocation: state.currentLocation,
    zoom: state.map.zoom,
    currentDays: state.currentDays,
    currentDistance: state.currentDistance,
    eventsData: state.eventsData,
    placesData: state.placesData
});

const MobilePage = connect(
    mapStateToProps,
    // Or actions
    actions
)(Mobile);

export default MobilePage;