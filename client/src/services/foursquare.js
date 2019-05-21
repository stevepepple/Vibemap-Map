/**
 * Foursquare service utils
 */

const request = require('request-promise');
const GeoJSON = require('geojson');

const FOURSQUARE_CLIENT_ID = 'MFA1H1MN4RRH33TLXVTMD22NI5YASHPM10WV0HFZQCKW0TA0'
const FOURSQUARE_SECRET = '2UX3X1FMXUJHRJ3GII2QNBELJ3UEU2HOOQ3X4KG2LRWIMCN5'

module.exports = {
    placeToGeoJSON(place) {
        let geojson = GeoJSON.parse(place, { Point: ['latitude', 'longitude'] });

        return geojson;
    },

	getPlaceDetails(id) {
		return new Promise((resolve, reject) => {
            request({
                url: 'https://api.foursquare.com/v2/venues/' + id,
                method: 'GET',
                qs: {
                    client_id: FOURSQUARE_CLIENT_ID,
                    client_secret: FOURSQUARE_SECRET,
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
                // TODO: Handle ranking server-side
                place.url = place.canonicalUrl
                place.reason = place.reasons.items[0]

                place.likes = place.likes.count;
                place.score = place.likes;

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

                //all_places.push(place)
                resolve(place)

            })
            .catch(function (err) {
                reject(err);
            })

		});
    }
    
    
};