const Constants = require('../constants')
const querystring = require('querystring')
const moment = require('moment')
const helpers = require('../helpers.js')
const turf = require('@turf/turf')

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
                per_page: 100
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
    getPlaceDetails: function (id) {
        return new Promise(function (resolve, reject) {
            fetch(ApiUrl + "/v0.2/places/" + id, { headers: ApiHeaders })
                .then(data => data.json())
                .then(result => {
                    clearTimeout(timeout);
                    console.log("Got place details: ", result)
                    resolve({ data: result, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                })
        })
    },

    // TODO: Include a way to query by time of day
    getPicks: function (point, distance, activity, vibes, search) {
 
        // Don't allow distance to be negative.
        let distanceInMeters = 1
        if (distance > 0) distanceInMeters = distance * Constants.METERS_PER_MILE
        
        // TODO: Load more points at greater distances?        
        return new Promise(function (resolve, reject) {
            let params = {
                // lat: this.state.lat,
                // lon: this.state.lon,
                ordering: '-aggregate_rating',
                point: point,
                dist: distanceInMeters,
                categories: activity,
                search: search,
                vibes: vibes,
                per_page: 50
            }

            if (activity) {
                params["category"] = activity
            }

            let center_point = point.split(',').map(value => parseFloat(value))

            let query = querystring.stringify(params);

            fetch(ApiUrl + "/v0.2/places/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {

                    clearTimeout(timeout);
                    let places_scored_and_sorted = module.exports.scorePlaces(res.results.features, center_point)

                    resolve({ data: places_scored_and_sorted, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        })
    },

    // TODO: Include a way to query by time of day
    getPlaces: function (point, distance, activity, vibes, search_term) {

        let distanceInMeters = 1
        if (distance > 0) distanceInMeters = distance * Constants.METERS_PER_MILE

        
        // TODO: Load more points at greater distances?        
        return new Promise(function (resolve, reject) {
            let params = {
                ordering: '-aggregate_rating',
                point: point,
                dist: distanceInMeters,
                categories: activity,
                search: search_term,
                per_page: 500
            }

            if (activity) {
                params["category"] = activity
            }

            let center_point = point.split(',').map(value => parseFloat(value))

            let query = querystring.stringify(params);

            fetch(ApiUrl + "/v0.2/places/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {

                    clearTimeout(timeout);
                    let places_scored_and_sorted = module.exports.scorePlaces(res.results.features, center_point)

                    resolve({ data: places_scored_and_sorted, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        })
    },

    scorePlaces: function(places, center_point, vibes) {
        let max_event_score = 1
        let max_vibe_score = 1
        let max_aggregate_score = 1
        let max_distance = 1

        let vibe_match_bonus = 10

        let place = places.map((place) => {
            place.properties.aggregate_rating = parseFloat(place.properties.aggregate_rating)

            // Give place a vibe score
            place.properties.vibe_score = place.properties.vibes.length

            // Give direct vibe matches bonus points
            let vibe_matches = 0
            let vibe_bonus = 0
            if (vibes && place.properties.vibes) {
                vibe_matches = helpers.default.matchLists(vibes, place.properties.vibes)
            }

            vibe_bonus = vibe_matches * vibe_match_bonus
            place.properties.vibe_score += vibe_bonus


            // TODO: Places that match vibe get a bonus

            // Give place an event score
            // TODO: Sum of events is a stand in for a better metric of a places relevance
            
            place.properties.num_events = place.properties.hotspots_events.features.length
            
            // TODO: why is this needed for icon points
            place.properties.id = place.id


            if (place.properties.num_events > 0) {
                let likes = place.properties.hotspots_events.features[0].properties.likes
                // TODO: Whats an appropriate ceiling to rank against
                let like_score = 0
                if(likes) like_score = likes / 100

                // Simple sum of score works for now
                place.properties.event_score = place.properties.num_events + likes
            } else {
                place.properties.event_score = 0
            }

            if (place.properties.aggregate_rating >= 2) {

                if (place.properties.categories == undefined || place.properties.categories.length == 0) {
                    place.properties.categories = ["missing"]
                    // TODO: Fix missing and duplicate places.
                    //console.log("missing: ", place.properties.name)
                }

            } else {
                place.properties.aggregate_rating = 2
            }

            if (place.properties.aggregate_rating > max_aggregate_score)  max_aggregate_score = place.properties.aggregate_rating

            if (place.properties.vibe_score > max_vibe_score) max_vibe_score = place.properties.vibe_score

            if (place.properties.event_score > max_event_score) max_event_score = place.properties.event_score
        
            if(center_point) {
                let point = turf.point(place.geometry.coordinates)
                place.properties.distance = turf.distance(center_point, point)

                if (place.properties.distance > max_distance) max_distance = place.properties.distance
            }    

        })

        let places_scored = places.map((place) => {
            
            place.properties.event_score = helpers.default.normalize(place.properties.event_score, 0, max_event_score)
            place.properties.vibe_score = helpers.default.normalize(place.properties.vibe_score, 0, max_vibe_score)
            place.properties.aggregate_rating = helpers.default.normalize(place.properties.aggregate_rating, 0, max_aggregate_score)
            // Distance is inverted from max and then normalize 1-10
            place.properties.distance = helpers.default.normalize(max_distance - place.properties.distance, 0, max_distance)

            // Simple average of the different scores
            place.properties.average_score = place.properties.event_score + place.properties.vibe_score + place.properties.aggregate_rating + place.properties.distance / 4

            return place
        })

        let places_scored_and_sorted = places_scored.sort((a, b) => {
            return b.properties.average_score - a.properties.average_score
        })

        return places_scored_and_sorted
    },
}
