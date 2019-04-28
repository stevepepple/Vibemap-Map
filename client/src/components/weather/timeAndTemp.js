import React, { Component } from 'react';
import { connect } from 'react-redux';
import { css } from '@emotion/core'


import querystring from 'querystring';
import WeatherIcon from 'react-icons-weather';
import moment from 'moment';

import helpers from '../../helpers.js'
import variables from '../../styles/variables.scss'

import { isAbsolute } from 'path';
import { PURPLE } from '../../constants.js';


class TimeAndTemp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            current_weather: 'owm',
            icon_id: '200',
            temp: '30',
            time_of_day: 'morning'
        };

    }

    componentWillMount() {

        this.getWeather()
        let time_of_day = helpers.getTimeOfDay(moment());
        this.setState({ time_of_day })

    }

    getWeather() {

        console.log('Current Location: ', this.props.location, this.props)

        let query = querystring.stringify({
            lat: this.props.location.lat,
            lon: this.props.location.lon
        });

        console.log(query)

        fetch("/api/weather?" + query)
            .then(data => data.json())
            .then(res => {
                
                let code = res.data.weather[0].id.toString();
                let temp = res.data.main.temp;
                
                this.setState({ icon_id : code, temp: temp })
                
            }, (error) => {
                console.log(error)
            });
    }


    render() {   
        
        const style = {
            padding: '1em',
            paddingTop: '0.2em',
            fontSize: '1.4em',
            color: variables.colorPurple

        }

        const float = {
            position: 'absolute',
            right: '1em'
        }

        const temp = Math.round(this.state.temp)

        return (
            <div id='time_and_temp' style={style}>
                <div style={float}>
                    <WeatherIcon name='owm' iconId={this.state.icon_id} style={{ fontSize: '2em' }} /> <span>{temp} &#176;</span>
                </div>
                <span>Good {this.state.time_of_day}!</span>
                
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    //console.log('store to weather: ', state)
    return {
        location: state.current_location,
    }
};

export default connect(mapStateToProps)(TimeAndTemp);