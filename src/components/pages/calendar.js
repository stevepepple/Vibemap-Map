import React, { Component } from 'react'

import { connect } from 'react-redux'
import * as actions from '../../redux/actions'


import helpers from '../../helpers.js'
import queryString from 'querystring'
import isEqual from 'react-fast-compare'
import moment from 'moment'

import { Calendar, momentLocalizer } from 'react-big-calendar'

import 'react-big-calendar/lib/css/react-big-calendar.css'

import VibeMap from '../../services/VibeMap.js'
import Header from '../elements/header.js'
import Navigation from '../events/navigation.js'

class EventCalendar extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            // TODO: Update from YAML or API list
            vibe_categories: ['adventurous', 'artsy', 'authentic', 'civic', 'chill', 'cozy', 'creative', 'energetic', 'exclusive', 'festive', 'free', 'friendly', 'healthy', 'local', 'romantic', 'interactive', 'inspired', 'vibrant', 'lively', 'outdoors', 'scenic', 'positive', 'unique'],
            localizer: momentLocalizer(moment),
            height: window.innerHeight,
            events: [
                {
                    id: 0,
                    title: 'All Day Event very long title',
                    allDay: true,
                    start: moment(),
                    end: moment().add(1, 'hours').toDate(),
                },
                {
                    id: 1,
                    title: 'Long Event',
                    start: moment(),
                    end: moment().add(1, 'hours').toDate(),
                }
            ]

        }
    }

    Event({ event }) {
        return (
            <span>
                <strong>{event.title}</strong>
                {event.desc && ':  ' + event.desc}
            </span>
        )
    }

    EventAgenda({ event }) {
        //console.log("New agenda event: ", event)
        return (
            <span>
                <h3>{event.title}</h3>
                {/* 
                <img width='200' src={event.images[0]}/>
                <p>Likes {event.likes}</p>
                */}
                <a href={event.url}>Event Link</a>
            </span>
        )
    }

    fetchCities() {
        VibeMap.getCities()
            .then(results => {
                this.props.setCities(results.data)
            })
    }

    componentWillMount() {

        // Set global state with user's location
        let params = queryString.parse(this.props.search)

        this.fetchCities()

        // Get location and event list
        if (params.latitude && params.longitude) {
            this.props.setCurrentLocation({ latitude: params.latitude, longitude: params.longitude })
        } else {            
            
            helpers.getPosition()
                .then((position) => {
                    if (position) {
                        this.props.setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })

                        this.fetchEvents()
                    } else {
                        // TODO: what if the user disallows location
                    }
                })
        }
    }

    componentDidUpdate(prevProps, prevState) {

        // TODO: should be a switch statement
        if (!isEqual(prevProps.currentLocation, this.props.currentLocation)) {
            this.fetchEvents()
        }

        window.addEventListener('resize', this.handleWindowSizeChange)
    }

    handleWindowSizeChange = () => {
        console.log("Height changed", window.innerHeight)
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        })
    }

    /* TODO: Should all of this logic just flow through an event service and component? */
    // Change to getPlaces
    fetchEvents(position) {
        let distance = 20
        let days = 14
        let point = `${this.props.currentLocation.longitude},${this.props.currentLocation.latitude}`
        if (this.state.timedOut === true) {
            this.setState({ timedOut: false })
        }

        /* Get current events, then set them in the state */
        /* TODO: package args into spread object? */

        VibeMap.getEvents(point, distance, null, this.state.event_categories, days, this.props.searchTerm)
            .then(results => {
                
                let events = results.data.map((result) => {
                    let event = result.properties

                    event.title = event.name
                    event.start = moment(event.start_date).toDate()
                    event.end = moment(event.start_date).add(1, 'hours').toDate()

                    if(event.end_date !== null) {
                        event.end = moment(event.end_date).toDate()
                    }

                    return event
                })

                //this.props.setEventsData(results.data)
                this.setState({ loading: false, timedOut: false, events: events })
            }, (error) => {
                console.log(error)
            })
    }

    render() {

        const navigation = <Navigation
            setActivity={this.setActivity}
            days={this.props.days}
            vibes={this.state.vibe_categories}
            activities={this.state.event_categories}
            activity={this.state.activity}
            />

        return (
            <React.Fragment>
                <Header />
                {navigation}                

                <Calendar
                    popup
                    localizer={this.state.localizer}
                    events={this.state.events}
                    startAccessor='start'
                    endAccessor='end'
                    style={{ height: this.state.height - 300 }}
                    components={{
                        event: this.Event,
                        agenda: {
                            event: this.EventAgenda,
                        },
                    }}
                />
            </React.Fragment>
            
        )

    }
}

const mapStateToProps = state => {
    return {
        activity: state.nav.activity,
        cities: state.nav.allCities,
        currentLocation: state.nav.currentLocation,
        distance: state.map.distance,
        searchTerm: state.nav.searchTerm,
        eventsData: state.eventsData,
    }
}

export default connect(mapStateToProps, actions)(EventCalendar);