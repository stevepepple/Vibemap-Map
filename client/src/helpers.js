import * as Constants from './constants.js'

import { scaleLinear, scalePow } from 'd3-scale'

import * as turf from '@turf/turf'
import geoViewport from '@mapbox/geo-viewport'

const helpers = {

    // Get HTML Position
    getPosition: function(options) {
        return new Promise(function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(function (position) {
                resolve(position);
            });

        })
    },

    getBounds: function(location, zoom, size) {
        let bounds = geoViewport.bounds([location.longitude, location.latitude], zoom, [size.width, size.height], 512)
        console.log("Got bounds for: ", location, zoom, size, bounds)
        return bounds
    },

    getRadius: function (bounds) {        
        //let bounds = geoViewport.bounds([location.longitude, location.latitude], zoom, [window.width, window.height])
        let diameter = turf.distance(
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
            { units: 'miles'}
        )

        let width = turf.distance(
            [bounds[0], bounds[3]],
            [bounds[2], bounds[3]],
            { units: 'miles' }
        )
        
        console.log('Diameter is: ', diameter)
        console.log('Width is: ', width)

        let distance = diameter / 2

        console.log("RADIUS is ", distance, " miles")

        return distance
    },

    getDistanceToPixels(bounds, window) {
        const left = bounds[0]
        const bottom = bounds[1]
        const right = bounds[2]
        //const top = bounds[3]

        const options = { unit: 'miles' }
        
        const latitudinal_distance = turf.distance([left, bottom],[right, bottom], options)
        //const longitudinal_distance = turf.distance([left, bottom], [left, top], options)

        let pixel_ratio = latitudinal_distance / window.width

        return pixel_ratio

    },

    zoomToRadius : function(zoom) {
        
        // Scale and interpolate radius to zoom siz
        let zoom_to_radius_scale = scalePow(1)
          .domain([8,  12, 13, 14, 16, 18]) // Zoom size
          .range([ 40, 7,  3,  3.5, 1.5,  0.8]) // Scale of search radius

        let new_zoom = zoom_to_radius_scale(zoom)
        
        return new_zoom
    },

    scaleIconSize: function(score, max) {
        let scale = scalePow(1)
            .domain([0, max])
            .range([2, 5])
        
        return scale(score)
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
        
        return time_of_day;
    },

    // Counts the number of matches between the two lists and return and integer
    matchLists: function(listA, listB ) {
        let matches = 0;
        
        if (listA.length > 0 && listB.length > 0) {
            matches = listA.filter((word) => { return listB.includes(word) }).length
        }

        return matches;
    },

    rankVibes: function(listA, listB) {
        let rankings = []

        rankings = listA.map((word) => {
            let score = 0
            
            if (listB.includes(word)) {
                score = listB.length - listB.indexOf(word)
            }
            
            return score
        })

        const average = rankings.reduce((a, b) => a + b, 0) / rankings.length

        return average
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

    scaleMarker: function(score, min, max, zoom) {
        // TODO: Is this max right? 
        if (!min) { min = 0 }
        if (!max) { max = 100 }

        // Scale min and max marker size to zoom level
        let marker_scale = scalePow(1)
            .domain([8, 20]) // Zoom size
            .range([10, 30]) // Scale of marker size
        
        let base_marker = marker_scale(zoom)
        let max_marker = base_marker * 3

        let scale = scalePow(1)
            .domain([0, max])
            .range([base_marker, max_marker])
                
        let scaled_size = Math.round(scale(score))        

        return scaled_size
    },
    
    scaleSelectedMarker: function (zoom) {
        // TODO: Is this max right?         

        // Scale em size of svg marker to zoom level
        let scale = scalePow(1)
            .domain([8, 12, 20]) // Zoom size
            .range([0.1, 1, 5]) // Scale of marker size
    
        let scaled_size = Math.round(scale(zoom))

        return scaled_size
    },


    getMax: function(items, attribute) {
        let max = 0;
        items.forEach(item => {
            let value = item['properties'][attribute]
            if (value > max) { 
                max = value 
            }
        })

        return max
    },

    getMin: function (items, attribute) {
        let min = 100
        items.forEach(item => {
            let value = item['properties'][attribute]
            if (value < min) {
                min = value
            }
        })

        return min
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
    },

    toTitleCase: function(str) {
        if (typeof(str) == "string") {
            str = str.toLowerCase().split(' ');
            for (var i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
            }
            return str.join(' ');
        } else {
            return str
        }
        
    }
}

export default helpers;