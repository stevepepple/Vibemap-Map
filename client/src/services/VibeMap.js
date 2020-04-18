const Constants = require('../constants')
const querystring = require('querystring')
const moment = require('moment')
const helpers = require('../helpers.js')
const truncate = require('truncate')
const turf = require('@turf/turf')

const ApiHeaders = new Headers({
    'Authorization': 'Token ' + Constants.SYSTEM_TOKEN
});

// TODO: tie this value to the DEV or PROD var
//const ApiUrl = 'http://192.168.99.100:8888'
const ApiUrl = 'https://api.vibemap.com'

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
            
            fetch(ApiUrl + '/v0.3/boundaries/')
                .then(data => data.json())
                .then(res => {                    
                    clearTimeout(timeout);
                    resolve({ data: res.results, loading: false, timedOut: false })
                }, (error) => {
                    console.log(error)
                });
        }); 
    },

    getCategories: function () {
        return new Promise(function (resolve, reject) {            

            fetch(ApiUrl + "/v0.3/category-list/")
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout)                    
                    resolve({ data: res, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        });
    },

    getDirections: function(waypoints) {
        return new Promise(function (resolve, reject) {
            const service = 'https://api.mapbox.com/directions/v5/mapbox/walking/'
            let query = querystring.stringify({
                access_token: Constants.MAPBOX_TOKEN,
                geometries: 'geojson',
                steps: true,
                waypoints: []
            })

            const start = waypoints[0]
            const end = waypoints[waypoints.length - 1]

            let start_end = String(start) + ';' + String(end)
            //if (waypoints !== undefined) query['waypoints'] = query += 'waypoints=' + waypoints.join(';')
            
            start_end = waypoints.join(';')
            console.log('Getting directions for ', start_end, query)

            fetch(service + start_end + "?" + query)
                .then(data => data.json())
                .then(res => {
                    console.log('Got Directions: ', res)
                    clearTimeout(timeout)
                    resolve({ data: res, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
            })
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

            fetch(ApiUrl + "/v0.3/vibe-list/?" + query)
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout)
                    resolve({ data: res, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                })
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

    getGuides: function(){
        return new Promise(function (resolve, reject) {

        })
    },

    getNeighborhoods: function(){
        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                access_token : 'pk.eyJ1Ijoic3RldmVwZXBwbGUiLCJhIjoiTmd4T0wyNCJ9.1-jWg2J5XmFfnBAhyrORmw'
            })

            fetch(mapbox_url + "ck2v5hz4r1md12nqnfff9592e/features/?" + query)
                .then(data => data.json())
                .then(res => {
                    
                    clearTimeout(timeout);
                    resolve({ data: res, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        });
    },

    getEventDetails: function(id){
        return new Promise(function (resolve, reject) {
            fetch(ApiUrl + "/v0.3/events/" + id)
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
    getPlaceDetails: function (id, type) {
        // TODO: Handle Guides type
        if(type == null || type == undefined) type = 'places'
        return new Promise(function (resolve, reject) {
            fetch(ApiUrl + "/v0.3/"+ type + "/" + id)
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
    getPicks: function (point, distance, bounds, activity, vibes, search) {
 
        // Don't allow distance to be negative.
        let distanceInMeters = 1
        if (distance > 0) distanceInMeters = distance * Constants.METERS_PER_MILE

        if (activity === 'all') activity = null
        
        // TODO: Load more points at greater distances?
        // TODO: Load fewer points, once scoring is on the backend.
        return new Promise(function (resolve, reject) {
            let params = {
                // lat: this.state.lat,
                // lon: this.state.lon,
                ordering: '-aggregate_rating',
                point: point,
                dist: distanceInMeters,
                //in_bbox: bounds.toString(),
                categories: activity,
                search: search,
                vibes: vibes,
                per_page: 100
            }

            if (activity) params["category"] = activity
            
            let center_point = point.split(',').map(value => parseFloat(value))
            let query = querystring.stringify(params);

            fetch(ApiUrl + "/v0.3/places/?" + query)
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout);
                    const count = res.count

                    let places = module.exports.formatPlaces(res.results.features)
                    let places_scored_and_sorted = module.exports.scorePlaces(places, center_point, vibes, ['aggregate_rating', 'vibes', 'distance'])                    
                    // TODO: clustering could happen before and after identification of picks; for now just do it after
                    //let clustered = module.exports.clusterPlaces(places_scored_and_sorted, 0.2)
                
                    let top_vibes = module.exports.getTopVibes(places)
                    
                    resolve({ data: places_scored_and_sorted, count: count, top_vibes: top_vibes, loading: false, timedOut: false })

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
        let center_point = point.split(',').map(value => parseFloat(value))

        if (activity === 'all') activity = null

        let day_start = moment().startOf('day').utc().format("YYYY-MM-DD HH:MM")
        let day_end = moment().add(days, 'days').utc().format("YYYY-MM-DD HH:MM")
        
        // TODO: Load more points at greater distances?
        return new Promise(function (resolve, reject) {
            let params = {
                ordering: '-aggregate_rating',
                point: point,
                //in_bbox: bounds.toString(),
                dist: distanceInMeters,
                start_date_after: day_start,
                end_date_before: day_end,
                categories: activity,
                search: search_term,
                per_page: 400
            }

            if (activity) {
                params["category"] = activity
            }

            let query = querystring.stringify(params);

            fetch(ApiUrl + "/v0.3/places/?" + query)
                .then(data => data.json())
                .then(res => {

                    const count = res.count
                    clearTimeout(timeout);
                    let places = module.exports.formatPlaces(res.results.features)
                    let places_scored_and_sorted = module.exports.scorePlaces(places, center_point, vibes, ['aggregate_rating', 'vibes', 'distance'])
                    //let clustered = module.exports.clusterPlaces(places_scored_and_sorted, 0.2)
                
                    let top_vibes = module.exports.getTopVibes(res.results.features)
                    // TODO: remove this quick way of export the current data results to a map
                    //console.log(JSON.stringify(res))
                    resolve({ data: places_scored_and_sorted, count: count,  top_vibes: top_vibes, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        })
    },

    // TODO: Include a way to query by time of day
    searchPlaces: function (search_term) {

        return new Promise(function (resolve, reject) {
            let params = {
                search: search_term,
                per_page: 3
            }

            let query = querystring.stringify(params);

            fetch(ApiUrl + "/v0.3/places/?" + query)
                .then(data => data.json())
                .then(res => {

                    clearTimeout(timeout);
                    if (res.status > 400) {
                        return this.setState(() => {
                            return { data: null, loading: false, timedOut: false, message: res.status };
                        });
                    }
                    
                    let search_results = res.results.features.map((place) => {                        
                        let result = {
                            title: place.properties.name,
                            id: place.id,
                            key: place.id,
                            description: place.properties.address,
                            new: false
                        }
                
                        return result
                    })

                    search_results.push({
                        title : search_term,
                        key: null,
                        description : 'Add a new listing with this name.',
                        new: true
                    })

                    
                    resolve({ data: res.results.features, search_results: search_results, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)

                });
        })
    },

    getEvents: function (point, distance, bounds, activity, days, vibes, search_term) {

        let distanceInMeters = distance * Constants.METERS_PER_MILE
        let center_point = point.split(',').map(value => parseFloat(value))

        let day_start = moment().startOf('day').format("YYYY-MM-DD HH:MM")
        let day_end = moment().add(days, 'days').format("YYYY-MM-DD HH:MM")

        return new Promise(function (resolve, reject) {
            let query = querystring.stringify({
                point: point,
                dist: distanceInMeters,
                activity: activity,
                //days: days,
                ordering: "likes--",
                start_date_after: day_start,
                end_date_before: day_end,
                search: search_term,
                per_page: 100
            });

            fetch(ApiUrl + "/v0.3/events/?" + query)
                .then(data => data.json())
                .then(res => {
                    clearTimeout(timeout);
                    const count = res.count
                    // Apply some temporary scoring to events to make them show up better.
                    let event_places = module.exports.formatEvents(res.results.features)
                    let scored = module.exports.scorePlaces(event_places, center_point, vibes, ['vibes', 'distance', 'likes'])

                    resolve({ data: scored, count: count, loading: false, timedOut: false })

                }, (error) => {
                    console.log(error)
                });
        })
    },

    formatEvents: function (events) {
        let formatted = events.map((event) => {
            let fields = event.properties

            // Add fields for presentation
            fields.place_type = 'events'
            fields.short_name = truncate(fields.name, Constants.TRUCATE_LENGTH)
            fields.aggregate_rating = parseFloat(fields.aggregate_rating)
            if (fields.categories === undefined || fields.categories.length === 0) {
                fields.categories = ["missing"]
            }

            if (fields.vibes === undefined) fields.vibes = ['chill']

            fields.cluster = null
            // TODO: why is this needed for icon points
            fields.id = event.id

            event.properties = fields
            return event
        })
        return formatted
    },

    formatPlaces: function(places) {
        let formatted = places.map((place) => {
            let fields = place.properties
            
            // Add fields for presentation
            fields.place_type = 'places'
            fields.short_name = truncate(fields.name, Constants.TRUCATE_LENGTH)
            fields.aggregate_rating = parseFloat(fields.aggregate_rating)
            if (fields.categories === undefined || fields.categories.length === 0) {
                fields.categories = ["missing"]
            }
            fields.cluster = null
            // TODO: why is this needed for icon points
            fields.id = place.id

            place.properties = fields
            return place
        })
        return formatted
    },

    // Sorts Events and Places by their vibes and other fields
    scorePlaces: function(places, center_point, vibes, scoreby) {
        scoreby = scoreby || ['vibes', 'distance']

        // Default max values; These will get set by the max in each field
        let max_scores = {}
        scoreby.map((field) => max_scores[field] = 1)

        const vibe_match_bonus = 10
        const vibe_rank_bonus = 5
        const distance_factor = 0.4 // Weight distance different than other fields
        
        // Get scores and max in each category
        let places_scored = places.map((place) => {

            let fields = place.properties

            if (scoreby.includes('distance')) {
                const point = turf.point(place.geometry.coordinates)
                fields.distance = turf.distance(center_point, point)
                // Set max distance
                if (fields.distance > max_scores['distance']) {
                    max_scores['distance'] = fields.distance
                }
            }

            if (scoreby.includes('vibes')) {
                // Give place a vibe score
                let [vibe_matches, average_rank, vibe_bonus] = [0, 0, 0]

                fields.vibes_score = 0
                // TODO: TEMP until events return vibes
                if (fields.vibes === undefined) fields.vibes = ['chill']
                if (fields.vibes.length > 0) fields.vibes_score = fields.vibes.length

                // TODO: Don't show markers without photos; this will analyze the vibe and quality of the image
                if (fields.images.length > 0) vibe_bonus += vibe_match_bonus
                
                // Give direct vibe matches bonus points
                if (vibes.length > 0 && fields.vibes) {
                    vibe_matches = helpers.default.matchLists(vibes, fields.vibes)
                    average_rank = helpers.default.rankVibes(vibes, fields.vibes)

                    vibe_bonus = vibe_matches * vibe_match_bonus + average_rank * vibe_rank_bonus

                    fields.vibes_score += vibe_bonus
                }
                // Set max vibe score
                if (fields.vibes_score > max_scores['vibes']) {
                    max_scores['vibes'] = fields.vibes_score
                } 
            }

            if (scoreby.includes('likes')) {
                // Set max aggregate score
                if (fields.likes > max_scores['likes']) {
                    max_scores['likes'] = fields.likes
                }
            }

            if (scoreby.includes('aggregate_rating')) {
                // Set max aggregate score
                if (fields.aggregate_rating > max_scores['aggregate_rating']) {
                    max_scores['aggregate_rating'] = fields.aggregate_rating
                }
            }

            place.properties = fields
            return place
        })

        // Normalize each place by the top scores across all results
        let places_scored_averaged = places_scored.map((place) => {
            let fields = place.properties

            if (scoreby.includes('vibes')) fields.vibes_score = helpers.default.normalize(fields.vibes_score, 0, max_scores['vibes'])

            if (scoreby.includes('likes')) fields.likes_score = helpers.default.normalize(fields.likes, 0, max_scores['likes'])

            if (scoreby.includes('aggregate_rating')) fields.aggregate_rating_score = helpers.default.normalize(fields.aggregate_rating, 2, max_scores['aggregate_rating'])
            
            // Distance is inverted from max and then normalize 1-10
            // TODO: There might be something off about this score; should come from backend
            if (scoreby.includes('distance')) {
                let max_distance = max_scores['distance']
                fields.distance_score = helpers.default.normalize(max_distance - fields.distance, 0, max_distance)

                fields.distance_score = fields.distance_score * distance_factor
            }

            let reasons = scoreby
        
            let scores = scoreby.map((field) => fields[field + '_score'])

            let largest_index = scores.indexOf(Math.max.apply(null, scores))
            
            fields.average_score = scores.reduce((a, b) => a + b, 0) / scores.length

            // Add a reason code
            fields.reason = reasons[largest_index]

            // Create a scaled icon; TODO: Share logic with markers
            // Normalize the icon size to match photo markers.
            fields.icon_size = helpers.default.scaleIconSize(fields.average_score, 10)
           
            place.properties = fields
            return place
        })

        // Resort by average score 
        let places_scored_and_sorted = places_scored_averaged.sort((a, b) => b.properties.average_score - a.properties.average_score)

        
        /* TODO: for debugging only 
        places_scored_and_sorted.map((place) => {
            console.log(place.properties.name)
            console.log(' - vibes_score: ', place.properties.vibes_score)
            console.log(' - aggregate rating: ', place.properties.aggregate_rating_score)
            console.log(' - distance: ', place.properties.distance_score)
            console.log(' - reason: ', place.properties.reason)
        })
        */
        
        return places_scored_and_sorted
        
    },

    clusterPlaces: function(places, cluster_size) {
        
        let collection = turf.featureCollection(places)

        // TODO: Adjust cluster measure at each zoom level? 
        let clustered = turf.clustersDbscan(collection, cluster_size, { mutate: false, minPoints: 2 })

        let results = []

        turf.clusterEach(clustered, 'cluster', function (cluster, clusterValue, currentIndex) {
            // Only adjust clusters
            if (clusterValue !== 'null') {
                let center = turf.center(cluster)

                let max_score = helpers.default.getMax(cluster.features, 'average_score')
                let size = cluster.features.length

                /* For testing purposes: 
                console.log('--- Max score for cluster: ', max_score)
                console.log('--- Center of cluster: ', center)
                console.log('--- Size of cluster: ', size)
                */

                // TODO: Handle sorting & sizing based on score and distance. 
                turf.featureEach(cluster, function (currentFeature, featureIndex) {

                    let fields = currentFeature.properties
                    let vibes_score = fields.vibes_score
                    let score_diff = max_score - vibes_score

                    let distance = turf.rhumbDistance(center, currentFeature)
                    let bearing = turf.rhumbBearing(center, currentFeature)
                    let destination = turf.rhumbDestination(center, distance * 2, bearing)

                    // Move the point based on the rhumb distance and bearing from the cluster center.
                    fields.offset = destination.geometry

                    // Give point more cluster attributes
                    fields.in_cluster = true
                    fields.top_in_cluster = 'false'

                    if (fields.average_score  >= max_score) {
                        fields.top_in_cluster = 'true'
                    } else {
                        fields.icon_size = fields.icon_size / 1.5
                    }
                    //currentFeature.properties.vibe_score = (vibe_score - score_diff) * bonus

                    currentFeature.properties = fields
                    results.push(currentFeature)
                    //=currentFeature
                    //=featureIndex
                    //console.log("Cluster: ", currentFeature.properties.dbscan)
                })


            } else {
                turf.featureEach(cluster, function (currentFeature, featureIndex) {
                    currentFeature.properties.in_cluster = false
                    currentFeature.properties.top_in_cluster = 'true'

                    results.push(currentFeature)
                })
            }

        })

        // Put larger markers on top
        // TODO: Also set the details for the cluster
        // TODO: Define sorting one place so it dones't get messed up
        results = results.sort((a, b) => {
            return b.properties.average_score - a.properties.average_score
        })

        return results

    }
}
