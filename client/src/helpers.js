import request from 'request-promise'
import * as Constants from './constants.js'

import { scaleLinear, scalePow } from 'd3-scale'
import * as turf from '@turf/turf'

const helpers = {

    // Get HTML Position
    getPosition: function(options) {
        return new Promise(function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(function (position) {
                resolve(position);
            });

        })
    },

    zoomToRadius : function(zoom) {
        // Scale and interpolate radius to zoom siz
        let zoom_to_radius_scale = scalePow(1)
          .domain([8,  12, 13, 14, 18]) // Zoom size
          .range([ 40, 7,  3,  3.5,  0.8]) // Scale of search radius

        let new_zoom = zoom_to_radius_scale(zoom)
        
        return new_zoom
    },

    getCategoryMatch(categories) {
        const all_categories = Constants.place_categories.map(category => category.key)
        let matches = []
        categories.map(category => {
            if (all_categories.includes(category)) {
                matches.push(category)
            } 
        })

        return matches
    },

    normalize : function(val, min, max) { 
        return (val - min) / (max - min) * 10
    },

    // Adapted from https://gist.github.com/James1x0/8443042
    getTimeOfDay : function(moment) {
	    var time_of_day = null; //return g
	
	    if(!moment || !moment.isValid()) { return; } //if we can't find a valid or filled moment, we return.
	
	    var split_afternoon = 12 // 24hr time to split the afternoon
	    var split_evening = 17 // 24hr time to split the evening
	    var currentHour = parseFloat(moment.format("HH"));
	
        if(currentHour >= split_afternoon && currentHour <= split_evening) {
            time_of_day = "afternoon";
        } else if(currentHour >= split_evening) {
            time_of_day = "evening";
        } else {
            time_of_day = "morning";
        }
        console.log(time_of_day)
        return time_of_day;
    },

    // Counts the number of matches between the two lists and return and integer
    matchLists: function(listA, listB ) {
        let matches = 0;
        //console.log(listA, listB)
        if (listA.length > 0 && listB.length > 0) {
            matches = listA.filter((word) => { return listB.includes(word) }).length
        }

        return matches;
    },

    sortLocations: function(locations, currentLocation) {

        let current = turf.point([currentLocation.longitude, currentLocation.latitude])
        // Sort the list of places based on closness to the users
        let sorted_locations = locations.sort((a, b) => {
            let point_a = turf.point(a.centerpoint)
            let point_b = turf.point(b.centerpoint)
            a.distance = turf.distance(current, point_a)
            b.distance = turf.distance(current, point_b)
            
            if (a.distance < b.distance) {
                return 1
            } else {
                return -1
            }
        
        })

        return sorted_locations
    },

    topFoursquareResult: function(results) {

        return new Promise(function (resolve, reject) {

            let places = results.response.groups[0].items;

            // Promist for each Foursquare result
            let promises = new Array()
            let all_places = new Array()

            places.map((item) => {
                let place = item.venue
                console.log("Does this place exist: ", place.name)
                promises.push(
                    request({
                        url: 'http://localhost:5000/api/place_exists',
                        method: 'GET',
                        qs: {
                            id: place.id,
                        }
                    })

                )
            });

            Promise.all(promises).then(function(results) {
                let all_places = [];

                // TODO: is there a better, consistent way to handle the batch of responses
                results.forEach(function(message){
                    let result = JSON.parse(message);

                    if (result.success === true) {
                        console.log("Resulting place: ", result.place)

                        // TODO: save to database
                        request.post('http://localhost:5000/api/places', { form: result.place },
                            function (err, httpResponse, body) {
                                if (err) { console.log(err); } 
                                else { console.log('Saved venue: ', body) }
                            })

                        all_places.push(result.place)
                        
                    }
                })

                resolve(all_places);
            });
            
        });        

    },

    findPlaceCategoriess: function(categories) {
        
        let combined = []
        Constants.all_categories.map(function(category){

            let isMatch = function(name) {
                var found = categories.indexOf(name)
                if (found > -1) {                    
                    return true;
                }
            }

            // Matches the search?
            let top_match = isMatch(category.name)
            if (top_match){ combined.push(category.name) }

            if (category.hasOwnProperty('categories')) {
                category.categories.map(function(sub_category){
                    
                    let child_match = isMatch(sub_category.name)

                    if (top_match || child_match ) {
                        combined.push(sub_category.name)
                    }
                    
                })
                
            }
        })

        return combined;
    },

    scaleMarker: function(score, max, zoom) {
        if (!max) { let max = 100 }

        //TODO: Scale marker to zoom size!
        let marker_scale = scalePow(0.2)
            .domain([10, 20]) // Zoom size
            .range([6, 40]) // Scale of marker size

        let base_marker = marker_scale(zoom)
        let max_marker = base_marker * 3;

        let scale = scalePow(1)
            .domain([0, max])
            .range([base_marker, max_marker]);

        return Math.round(scale(score))
    },

    getMax: function(items, attribute) {
        let max = 0;
        items.forEach(item => {
            let value = item['properties'][attribute]
            if (value > max) { 
                max = value 
            }
        })

        return max;

    },

    /* global setTimeout, clearTimeout */
    /* eslint-disable consistent-this, func-names */
    debounce: function(func, delay) {
        let _this;
        let _arguments;
        let timeout;


        const executeNow = () => {
            timeout = null;
            return func.apply(_this, _arguments);

        };

        console.log(_this, _arguments)


        return function () {
            _this = this;
            _arguments = arguments;

            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(executeNow, delay);
        };
    },

    itemExists: function (name) {

        return new Promise((resolve, reject) => {
            Event.find({ name: name }).limit(1)
                .then((result) => {
                    if (result.length > 0) {
                        resolve(true);
                    } else {
                        resolve(false)
                    }
                })
        })

    },

    fireEvent: function(id, event) {
        
        if(document.getElementById(id) !== null) {
            let new_event = new Event(event, { bubbles: true, cancelable: false });

            document.getElementById(id).dispatchEvent(new_event);

            if (document.getElementById(id).fireEvent) {

                
                document.getElementById(id).fireEvent(event);
            } else {
                
                /*
                var evObj = document.createEvent('Events');
                evObj.initEvent(event, true, false);
                */
                let new_event = new Event(event, { bubbles: true, cancelable: false });
                
                document.getElementById(id).dispatchEvent(new_event);
            }
        }
    }
}

export default helpers;