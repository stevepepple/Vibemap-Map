import request from 'request'
import * as Constants from './constants.js'

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
                    v: '20180323',
                    limit: 20
                }
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    let results = JSON.parse(body)
                    
                    if (results.response.groups.length == 0) {
                        reject('No results for search.')
                    } else {
                        console.log('Got Foursquare place...')
                        resolve(JSON.parse(body));
                    }
                }
            });
        });
    },

    topFoursquareResult: function(results) {

        return new Promise(function (resolve, reject) {

            let top = results.response.groups[0].items[0].venue;
            top.reason = results.response.groups[0].items[0].reason;
            //return top; 

            request({
                url: 'https://api.foursquare.com/v2/venues/' + top.id,
                method: 'GET',
                qs: {
                    client_id: Constants.FOURSQUARE_CLIENT_ID,
                    client_secret: Constants.FOURSQUARE_SECRET,
                    v: '20180323'
                }
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    let result = JSON.parse(body);
                    resolve(result.response.venue);
                }
            });
        });

        
        

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

    }
}

export default helpers;