const Constants = require('../constants')
const querystring = require('querystring')
const moment = require('moment')

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

    getCities: function() {
        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                // lat: this.state.lat,
                // lon: this.state.lon,
                //point: point,
                // distance: this.state.distance,
                //dist: distanceInMeters,
                //activity: activity,
                //days: days,                
            })

            fetch(ApiUrl + "/v0.2/boundaries/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout);
                    resolve({ data: res.results, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        }); 
    },

    getEvents: function(point, distance, activity, days, search_term) {
        
        let distanceInMeters = distance * Constants.METERS_PER_MILE

        let day_start = moment().startOf('day').format("YYYY-MM-DD HH:MM");
        let day_end = moment().add(days, 'days').format("YYYY-MM-DD HH:MM");

        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                // lat: this.state.lat,
                // lon: this.state.lon,
                point: point,
                // distance: this.state.distance,
                dist: distanceInMeters,
                //activity: activity,
                //days: days,                
                ordering: "likes--",
                start_date_after: day_start,
                end_date_before: day_end,
                search: search_term,
                per_page: 20
            });

            fetch(ApiUrl + "/v0.2/events/?" + query, { headers: ApiHeaders })
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
            fetch(ApiUrl + "/v0.2/events/" + id, { headers: ApiHeaders })
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
    getPlaces: function (point, distance, activity, vibes) {

        let distanceInMeters = distance * Constants.METERS_PER_MILE
        
        // TODO: Load more points at greater distances?        
        return new Promise(function (resolve, reject) {
            let params = {
                // lat: this.state.lat,
                // lon: this.state.lon,
                ordering: 'aggregateScore',
                point: point,
                dist: distanceInMeters,
                // TODO: Make two calls, one for all and one for vibe or search? 
                vibes: vibes,
                per_page: 2000
            }

            if (activity) {
                params["category"] = activity
            }

            let query = querystring.stringify(params);

            

            fetch(ApiUrl + "/v0.2/places/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout);
                    
                    //console.clear()
                    //console.log("distance: ", distanceInMeters)
                    console.log('Received this many places: ', res.results.features.length)
                    res.results.features.forEach(place => {
                        if (place.properties.aggregate_rating > 2) {
                            if (place.properties.categories == undefined || place.properties.categories.length == 0) {
                                place.properties.categories = ["resturaunt"]
                            }

                            if (place.properties.aggregate_rating > 4.0) {
                               //console.log(place.properties.name + " " + place.properties.aggregate_rating + " " + place.properties.categories)
                            }

                            
                        } else {
                            place.properties.aggregate_rating = 2
                        }
                        
                    });
                    //console.log(res.results.features);

                    resolve({ data: res.results.features, loading: false, timedOut: false })
                    
                }, (error) => {
                    console.log(error)
                });
        });
    }
}
