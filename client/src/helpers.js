import request from 'request-promise'
import * as Constants from './constants.js'

import moment from 'moment'
import mongoose from 'mongoose'

import { scaleLinear } from 'd3-scale'

let config = {}
let place_schema = {}

const helpers = {

    // Get HTML Position
    getPosition: function (options) {
        return new Promise(function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(function (position) {
                console.log(typeof (position))
                resolve(position);
            });

        });
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

    searchFoursquare: function (query, latlon) {
        console.log('query and latlon', query, latlon)
        return new Promise(function (resolve, reject) {

            request({
                url: 'https://api.foursquare.com/v2/venues/explore',
                method: 'GET',
                qs: {
                    client_id: Constants.FOURSQUARE_CLIENT_ID,
                    client_secret: Constants.FOURSQUARE_SECRET,
                    ll: latlon,
                    query: query,
                    // TODO: update based upon map radius 
                    radius: 750,
                    v: '20180323',
                    limit: 10
                }
            }).then(function (body) {
                let results = JSON.parse(body)
                    
                if (!results.response == undefined) {
                    reject('No results for search.')
                } else {
                    console.log('Got Foursquare place...', results.response)
                    resolve(results);
                }
            })
            
        });
    },

    topFoursquareResult: function(results) {

        return new Promise(function (resolve, reject) {

            let places = results.response.groups[0].items;

            // Promist for each Foursquare result
            let promises = new Array()
            let all_places = new Array()

            places.map((item) => {
                let place = item.venue
                promises.push(
                    request({
                        url: 'https://api.foursquare.com/v2/venues/' + place.id,
                        method: 'GET',
                        qs: {
                            client_id: Constants.FOURSQUARE_CLIENT_ID,
                            client_secret: Constants.FOURSQUARE_SECRET,
                            v: '20180323'
                        }
                    })
                    .then(function (parsedBody) {
                        let result = JSON.parse(parsedBody);
                        let place = result.response.venue;

                        place.has_details = true
                        place.latitude = place.location.lat
                        place.longitude = place.location.lng
                        place.neighborhood = place.location.neighborhood
                        place.address = place.location.address
                        place.crossStreet = place.location.crossStreet
                        place.url = place.canonicalUrl
                        place.reason = place.reasons.items[0]

                        if (place.photos.count > 0) {
                            place.image = place.bestPhoto.prefix + '200x200' + place.bestPhoto.suffix
                        }

                        delete place.location
                        delete place.bestPhoto
                        delete place.colors
                        delete place.attributes

                        place.categories = place.categories.map(function (category) {
                            return category.name;
                        });

                        place.likes = place.likes.count;

                        all_places.push(place)
                        return(place)                        

                    })
                    .catch(function (err) {
                        reject(err);
                    })

                )
            });

            Promise.all(promises).then(function(results) {
                resolve(all_places, results);
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

    scaleMarker: function(score, max) {
        if (!max) { let max = 1000 }

        let scale = scaleLinear()
            .domain([0, max])
            .range([32, 100]);

        return scale(score)
    },

    getMax: function(items, attribute) {
        let max = 0;
        items.forEach(item => {
            let value = item['properties']['likes']
            if (value > max) { 
                max = value 
            }
        })

        return max;

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
        if(document.getElementById(id) != null) {
            if (document.getElementById(id).fireEvent) {
                document.getElementById(id).fireEvent('on' + event);
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