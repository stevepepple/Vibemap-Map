const Constants = require('../constants')
const querystring = require('querystring')
const moment = require('moment')
const helpers = require('../helpers.js')

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
                    let max_event_score = 0;
                    let max_vibe_score = 0;
                    let max_aggregate_score = 0;

                    // Score indivisual results
                    res.results.features.forEach(place => {
                        place.properties.aggregate_rating = parseInt(place.properties.aggregate_rating)
                        
                        // Give place a vibe score
                        place.properties.vibe_score = place.properties.vibes.length;
                        // TODO: Places that match vibe get a bonus

                        // Give place an event score
                        // TODO: Sum of events is a stand in for a better metric of a places relevance
                        place.properties.num_events = place.properties.hotspots_events.features.length;                        
                        if (place.properties.num_events > 0 ) {
                            let likes = place.properties.hotspots_events.features[0].properties.likes
                            // TODO: Whats an appropriate ceiling to rank against
                            let like_score = likes / 100
                            // Simple sum of score works for now
                            place.properties.event_score = place.properties.num_events + likes                        
                        } else {
                            place.properties.event_score = 0
                        }                        

                        if (place.properties.aggregate_rating >= 2) {

                            if (place.properties.categories == undefined || place.properties.categories.length == 0) {
                                place.properties.categories = ["missing"]
                            }
                            
                        } else {
                            place.properties.aggregate_rating = 2
                        }

                        if (place.properties.aggregate_rating > max_aggregate_score) {
                            max_aggregate_score = place.properties.aggregate_rating
                        }

                        if (place.properties.vibe_score > max_vibe_score) {
                            max_vibe_score = place.properties.vibe_score
                        }

                        if (place.properties.event_score > max_event_score) {
                            max_event_score = place.properties.event_score
                        }
                    })

                    let places_scored = res.results.features.map((place) => {
                        place.properties.event_score = helpers.default.normalize(place.properties.event_score, 0, max_event_score)
                        place.properties.vibe_score = helpers.default.normalize(place.properties.vibe_score, 0, max_vibe_score)
                        place.properties.aggregate_rating = helpers.default.normalize(place.properties.aggregate_rating, 0, max_aggregate_score)

                        // Simple average of the different scores
                        place.properties.average_score = place.properties.event_score + place.properties.vibe_score + place.properties.aggregate_rating / 3

                        return place
                    })


                    let places_scored_and_sorted = places_scored.sort((a,b) => {
                        return b.properties.average_score - a.properties.average_score
                    })

                    resolve({ data: places_scored_and_sorted, loading: false, timedOut: false })
                    
                }, (error) => {
                    console.log(error)
                });
        });
    }
}
