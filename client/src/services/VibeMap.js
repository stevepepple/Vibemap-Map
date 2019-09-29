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
                days: days
            });

            fetch(ApiUrl + "/v0.1/events/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout);
                    console.log(res);
                    console.log('Received this many events: ', res.results.features.length)

                    resolve({ data: res.results.features, loading: false, timedOut: false })
                    //this.setState({ data: res.results.features, loading: false, timedOut: false })
                }, (error) => {
                    console.log(error)
                });    
        });
        

    }
}