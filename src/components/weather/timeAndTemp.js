import React, { Component } from 'react';
import { connect } from 'react-redux';

import querystring from 'querystring';
import WeatherIcon from 'react-icons-weather';
import dayjs from 'dayjs';

import helpers from '../../helpers.js'
import variables from '../../styles/variables.scss'

import { Translation } from 'react-i18next'

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
        let time_of_day = helpers.getTimeOfDay(dayjs())
        this.setState({ time_of_day })

    }

    getWeather() {

        let query = querystring.stringify({
            lat: this.props.location.lat,
            lon: this.props.location.lon
        });

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
                    <WeatherIcon name='owm' iconId={this.state.icon_id} style={{ fontSize: '1.8em', marginTop: '-4px' }} /> 
                    <span style={{ fontSize: '1.4em', paddingLeft: '0.4em'}}>{temp}&#176;</span>
                </div>
                <Translation>{
                    (t, { i18n }) => <p>{t('Good ' + this.state.time_of_day)} </p>
                }</Translation>            
                
            </div>
            
        );
    }
}

const mapStateToProps = state => {
    //console.log('store to weather: ', state)
    return {
        location: state.nav.currentLocation,
    }
};

export default connect(mapStateToProps)(TimeAndTemp);