const Constants = require('../constants')
const querystring = require('querystring')
const moment = require('moment')
const helpers = require('../helpers.js')
const turf = require('@turf/turf')

const ApiHeaders = new Headers({
    'Authorization': 'Token ' + Constants.SYSTEM_TOKEN
});

const ApiUrl = 'https://api.vibemap.com';
const mapbox_url = 'https://api.mapbox.com/datasets/v1/stevepepple/';

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

    getVibes: function () {
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

            fetch(ApiUrl + "/v0.2/vibes/?" + query, { headers: ApiHeaders })
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout)
                    console.log('Vibes list: ', res)
                    resolve({ data: res.results, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        });
    },

    getTopVibes: function(places){
        
        let top_vibes = {}

        places.map((place) => {
            place.properties.vibes.map((vibe) => {
                if (top_vibes.hasOwnProperty(vibe)) {
                    top_vibes[vibe] += 1
                } else {
                    top_vibes[vibe] = 1
                }            
            })
        })
        
        var sortable = [];
        for (var vibe in top_vibes) {
            sortable.push([vibe, top_vibes[vibe]]);
        }

        let top_vibes_sorted = sortable.sort(function (a, b) { return b[1] - a[1] });
        
        return top_vibes_sorted

    },

    getNeighborhoods: function(){
        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                access_token : 'pk.eyJ1Ijoic3RldmVwZXBwbGUiLCJhIjoiTmd4T0wyNCJ9.1-jWg2J5XmFfnBAhyrORmw'
            })

            fetch(mapbox_url + "ck2v5hz4r1md12nqnfff9592e" + "/features/" + "?" + query)
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout);
                    
                    resolve({ data: res, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        });
    },

    getEvents: function(point, bounds, activity, days, search_term) {
        
        //let distanceInMeters = distance * Constants.METERS_PER_MILE

        let day_start = moment().startOf('day').format("YYYY-MM-DD HH:MM")
        let day_end = moment().add(days, 'days').format("YYYY-MM-DD HH:MM")

        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                // lat: this.state.lat,
                // lon: this.state.lon,
                point: point,
                // distance: this.state.distance,
                //dist: distanceInMeters,
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
    getPicks: function (point, distance, bounds, activity, vibes, search) {
 
        // Don't allow distance to be negative.
        let distanceInMeters = 1
        if (distance > 0) distanceInMeters = distance * Constants.METERS_PER_MILE

        if (activity == 'all') activity = null
        
        // TODO: Load more points at greater distances?        
        return new Promise(function (resolve, reject) {
            let params = {
                // lat: this.state.lat,
                // lon: this.state.lon,
                ordering: '-aggregate_rating',
                point: point,
                dist: distanceInMeters,
                in_bbox: bounds.toString(),
                categories: activity,
                search: search,
                vibes: vibes,
                per_page: 200
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

                    let clustered = module.exports.clusterPlaces(places_scored_and_sorted, 0.2)
                    
                    resolve({ data: clustered, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        })
    },

    getHeatMap: function() {
        let url = 'https://tiles.vibemap.com/maps/places/11/325/793.mvt'

        return new Promise(function (resolve, reject) {
            fetch(url, { headers: ApiHeaders })
                .then(data => console.log(data))
                
        })
    },

    // TODO: Include a way to query by time of day
    getPlaces: function (point, distance, bounds, activity, days, vibes, search_term) {

        let distanceInMeters = 1
        if (distance > 0) distanceInMeters = distance * Constants.METERS_PER_MILE

        if (activity == 'all') activity = null

        let day_start = moment().startOf('day').utc().format("YYYY-MM-DD HH:MM")
        let day_end = moment().add(days, 'days').utc().format("YYYY-MM-DD HH:MM")

        console.log("Searching with these bounds: ", bounds.toString())

        
        // TODO: Load more points at greater distances?        
        return new Promise(function (resolve, reject) {
            let params = {
                ordering: '-aggregate_rating',
                point: point,
                in_bbox: bounds.toString(),
                dist: distanceInMeters,
                start_date_after: day_start,
                end_date_before: day_end,
                categories: activity,
                search: search_term,
                per_page: 100
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
                    let top_vibes = module.exports.getTopVibes(res.results.features)
                    // TODO: remove this quick way of export the current data results to a map
                    //console.log(JSON.stringify(res))
                    resolve({ data: places_scored_and_sorted, top_vibes: top_vibes, loading: false, timedOut: false })

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

        let top_vibes = {}

        let vibe_match_bonus = 10

        let place = places.map((place) => {
            place.properties.aggregate_rating = parseFloat(place.properties.aggregate_rating)

            // Give place a vibe score
            place.properties.vibe_score = place.properties.vibes.length

            place.properties.cluster = null
            // TODO: Add cluster scores

            // Give direct vibe matches bonus points
            let vibe_matches = 0
            let vibe_bonus = 0

            if (vibes && place.properties.vibes) {
                vibe_matches = helpers.default.matchLists(vibes, place.properties.vibes)
            }

            // console.log('Place vibes: ', place.properties.vibes)

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

            // Create a scaled icon; TODO: Share logic with markers
            place.properties.icon_size = helpers.default.normalize(place.properties.vibe_score, 0, max_vibe_score)
            
            // Distance is inverted from max and then normalize 1-10
            place.properties.distance = helpers.default.normalize(max_distance - place.properties.distance, 0, max_distance)
            
            // Simple average of the different scores
            let scores = [
                place.properties.event_score, 
                place.properties.vibe_score, 
                place.properties.aggregate_rating,
                place.properties.distance * 0.2 // Only make distance half as important
            ]
            
            // Average out the scores
            place.properties.average_score = scores.reduce((a, b) => a + b, 0) / scores.length

            //console.log('Score for place: ', place.properties.name)
            //console.log('Vibe: ', place.properties.vibe_score)
            //console.log('Rating: ', place.properties.aggregate_rating)
            //console.log('Distance: ', place.properties.distance)

            return place
        })

        let places_scored_and_sorted = places_scored.sort((a, b) => {
            return b.properties.average_score - a.properties.average_score
        })

        return places_scored_and_sorted
    },

    clusterPlaces: function(places, cluster_size) {
        

        let collection = turf.featureCollection(places)
        
        //console.log("Turf collection: ", collection)

        // TODO: Adjust cluster measure at each zoom level? 
        let clustered = turf.clustersDbscan(collection, cluster_size, { mutate: true })
        //console.log("Turf cluster: ", clustered)  

        let results = []
        let bonus = 0.2

        turf.clusterEach(clustered, 'cluster', function (cluster, clusterValue, currentIndex) {

            // Only adjust clusters
            if (clusterValue !== 'null') {
                let center = turf.center(cluster)

                let max = helpers.default.getMax(cluster.features, 'vibe_score')
                let size = cluster.features.length
                console.log('--- Max score for cluster: ', max)
                console.log('--- Size of cluster: ', size)

                // TODO: Handle sorting & sizing based on score and distance. 
                turf.featureEach(cluster, function (currentFeature, featureIndex) {
                    let vibe_score = currentFeature.properties.vibe_score
                    let score_diff = max - vibe_score            

                    let distance = turf.rhumbDistance(center, currentFeature)
                    let bearing = turf.rhumbBearing(center, currentFeature)
                    let destination = turf.rhumbDestination(center, distance * 2, bearing)

                    // Move the point based on the rhumb distance and bearing from the cluster center.
                    currentFeature.properties.offset = destination.geometry

                    // Give point more cluster attributes
                    currentFeature.properties.in_cluster = true
                    currentFeature.properties.top_in_cluster = false

                    if (score_diff == 0) {
                        currentFeature.properties.top_in_cluster = true
                        console.log("Top feature in cluster: ", currentFeature)
                    }
                    //currentFeature.properties.vibe_score = (vibe_score - score_diff) * bonus

                    results.push(currentFeature)
                    //=currentFeature
                    //=featureIndex
                    //console.log("Cluster: ", currentFeature.properties.dbscan)
                })


            } else {
                turf.featureEach(cluster, function (currentFeature, featureIndex) {
                    currentFeature.properties.in_cluster = false
                    currentFeature.properties.top_in_cluster = false
                    results.push(currentFeature)
                })
            }

        })

        // Put larger markers on top
        // TODO: Also set the details for the cluster
        results = results.sort((a, b) => {
            return a.properties.vibe_score - b.properties.vibe_score
        })

        return results

    }
}
