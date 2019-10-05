const Constants = require('../constants');
const querystring = require('querystring');

const ApiHeaders = new Headers({
    'Authorization': 'Token ' + Constants.SYSTEM_TOKEN
});

const ApiUrl = 'https://api.vibemap.com';

let timedOut = false

let timeout = setTimeout(() => {
    timedOut = true
}, Constants.TIMEOUT)

module.exports = {
    doSomething(arg) {
        console.log(arg)
    },

    getEvents: function(point, distance, activity, days) {

        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                // lat: this.state.lat,
                // lon: this.state.lon,
                point: point,
                // distance: this.state.distance,
                dist: distance,
                activity: activity,
                days: days,
                ordering: "score",
                per_page: 200
            });

            fetch(ApiUrl + "/v0.1/events/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {

                    clearTimeout(timeout);
                    resolve({ data: res.results.features, loading: false, timedOut: false })
                    
                }, (error) => {
                    console.log(error)
                });    
        });    
    },

    getEventDetails: function(id){
        return new Promise(function (resolve, reject) {
            fetch(ApiUrl + "/v0.1/events/" + id, { headers: ApiHeaders })
                .then(data => data.json())
                .then(result => {
                    clearTimeout(timeout);
                    resolve({ data: result, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                })
        })
    },

    // TODO: Include a way to query by time of day
    getPlaces: function (point, distance, activity) {

        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                // lat: this.state.lat,
                // lon: this.state.lon,
                point: point,
                // distance: this.state.distance,
                dist: distance,
                activity: activity,
                per_page: 1000
            });

            fetch(ApiUrl + "/v0.1/places/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout);
                    
                    //console.clear()
                    //console.log('Received this many places: ', res.results.features.length)
                    //console.log(res.results.features);

                    resolve({ data: res.results.features, loading: false, timedOut: false })
                    
                }, (error) => {
                    console.log(error)
                });
        });
    }
}