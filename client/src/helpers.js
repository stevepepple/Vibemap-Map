import * as Constants from './constants.js'

import { scaleLinear, scalePow } from 'd3-scale'

import chroma from 'chroma-js'
import * as turf from '@turf/turf'
import geoViewport from '@mapbox/geo-viewport'

import * as style_variables from 'vibemap-constants/design-system/build/json/variables.json';

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
        //console.log("Got bounds for: ", location, zoom, size, bounds)
        return bounds
    },

    getDistance: function (point_a, point_b) {
        let distance = turf.distance(
            [point_a[0], point_a[1]],
            [point_b[0], point_b[1]],
            { units: 'miles' }
        )

        return distance
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

        let distance = diameter / 2

        return distance
    },

    getArea: function (bounds) {
        
        //let bounds = geoViewport.bounds([location.longitude, location.latitude], zoom, [window.width, window.height])
        let height = turf.distance(
            [bounds[0], bounds[1]], // Southwest
            [bounds[0], bounds[3]], // Northwest
            { units: 'miles' }
        )

        let width = turf.distance(
            [bounds[0], bounds[1]], // Southwest
            [bounds[2], bounds[1]], // Southeast
            { units: 'miles' }
        )
  
        let area = height * width

        return area
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

    getVibeStyle(vibe) {
        let vibe_styles = style_variables['default']['color']['vibes']

        let dark_gray = style_variables['default']['color']['base']['gray']['1000']
        let light_gray = style_variables['default']['color']['base']['gray']['300']

        let css = { color: dark_gray, background: light_gray }

        if (vibe in vibe_styles) {
            let primary = vibe_styles[vibe]['primary']

            let luminance = chroma(primary).luminance()
            let brightness = 1.2
            if (luminance < 0.1) brightness += 2
            if (luminance < 0.3) brightness += 1

            let gradient = 'linear-gradient(45deg, ' + chroma(primary).brighten(brightness).hex() + ' 0%, ' + light_gray + ' 75%)'

            css['background'] = gradient

        }
        

        return css
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
            .range([2, 4])
        
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

    getHeatmap(colors, vibe) {
        
        //let colors = color.map((color, i) => choroma(color).alpha(0.2))
        let heatmap = []
        
        let blue = '#008ae5'
        let gray = '#B1E2E5'
        let yellow = '#F8EE32'
        let pink = '#ED0A87'
        let teal = '#32BFBF'
        let white = '#FFFFFF'
        
        let light_blue = '#54CAF2'
        let light_green = '#9DE862'
        let light_teal = '#7DCAA5'     
        let light_pink = '#E479B0'
        let light_purple = '#BC94C4'
        let light_yellow = '#FFFCC5'
        let light_orange = '#FBCBBD'
        let orange = '#F09C1F'
    
        //'yellow', 'lightgreen', '008ae5']
        let classic = ['blue', 'teal', 'yellow', 'orange']
        let blue_scale = ['gray', 'white', 'yellow', 'blue']
        let orange_scale = ['#B1E2E5',  'yellow', 'orange']
        let purple_scale = ['#B1E2E5', '#EDE70D', '#F27BA5', '#D76CE3']
        
        let spectral = chroma.scale('Spectral').colors(6).reverse()

        let green_purple = "PiYG"
        
        const vibe_to_scale = {
            'calm': [white, light_green, light_yellow, light_blue],
            'buzzing': [white, light_pink, light_yellow, orange],
            'dreamy': [white, light_purple, orange, light_yellow],
            'oldschool': [blue, yellow,  orange],
            'playful': [white, light_teal, yellow, orange],
            'solidarity': [white, light_yellow, yellow, orange],
            'together': [white, light_teal, light_yellow],
            'wild': green_purple
        }

        let scale = [white, light_purple, yellow, orange]

        if (vibe) {
            scale = vibe_to_scale[vibe]            
        }

        console.log('getHeatmap(colors, vibes): ', colors, vibe, scale)

        if (colors) {            
            let color1 = chroma('#fafa6e')
            let color2 = chroma('#fafa6e')
            scale = chroma.scale([colors])
        }

        heatmap = chroma.scale(scale)
            .mode('lch') // lab
            //.domain([0, .1, 0.9, 1])
            .colors(6)

        heatmap = heatmap
            //.reverse()
            .map((color, i) => {
                let alpha = i * 0.2
                let rgb = chroma(color)
                    .alpha(alpha)
                    //.brighten(i * 0.05)
                    .saturate(i * 0.05)
                    .css()
                console.log('heat layer ', i, rgb)
                return rgb
            })

        /*
        heatmap = chroma.cubehelix()
            .lightness([0.3, 0.8])
            .scale() // convert to chroma.scale
            .correctLightness()
            .colors(6)

        heatmap = chroma.scale('Spectral')
            //.scale() // convert to chroma.scale
            .colors(6)
        */

        return heatmap
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
            
            if (a.distance > b.distance) {
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

    scaleDensity: function (zoom, density) {        

        // Scale min and max marker size to zoom level
        // Could also be by area 
        // From sampling our cities
        // zoom level 10: min = 0; max = 16
        // zoom level 12: min = 0; max = 173
        // zoom level 14: min = 0; max = 800
        // zoom level 16: min = 0; max = 6870

        let max_density = scalePow(1)
            .domain([8, 10, 12, 14, 16]) // Zoom size
            .range([10, 20, 80, 800, 8000]) // Scale of marker size

        let max = max_density(zoom) 
        
        let density_scale = scalePow(1)
            .domain([0, max])
            .range([0, 1])
        
        let relative_density = density_scale(density)
        
        return relative_density
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