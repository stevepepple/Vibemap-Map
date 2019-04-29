const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const moment = require('moment')
const path = require('path')
const request = require('request')
const querystring = require('querystring');

const app = express()
app.use(cors())


// Local config
// TODO: This needs to move to a common repo
const config = require('./config');

require('dotenv').config();

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.once("open", () => console.log("Mongo DB  is connected."));

const Event = mongoose.model('Event', config.event_schema);
const Place = mongoose.model('Place', config.place_schema);


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use(express.static(path.join(__dirname, 'client/build')));

// Handle posts
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/api/hello', (req, res) => {
    console.log('Responding to request...');
    return res.json({ success: true, data: { hello : 'hello' } });
});

app.get('/api/save', (req, res) => {
    console.log('Responding to request...');
    return res.json({ success: true, data: config });
});

app.get('/api/directions', (req, res) => {

    let url = 'https://developer.citymapper.com/api/1/traveltime/?' + querystring.stringify(req.query)

    console.log(url)
    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred and handle it
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        //res.send(body)
        if (response.statusCode == '200' && error == null) {
            return res.json({ success: true, data: response });
        } else {
            console.log(error)
            return res.json({ success: false, data: { error } });
        }
    });

});

app.get('/api/events', (req, res) => {

    // TODO: pass number of days as an argument
    let day_start = moment().startOf('day');
    console.log("Day start", day_start)

    console.log('Search query: ', req.query)
    let day_end = moment().add(req.query.days, 'days');

    let lat = req.query.lat;
    let lon = req.query.lon;
    let distance = req.query.distance * config.meters_per_mile;
    let activity = req.query.activity;

    let activity_reg_ex = activity.map(function(category){
        return new RegExp(category);
    })

    // This is just the query
    let query_and_sort_by_likes = Event.find({
        'geometry': {
            $nearSphere: {
                $geometry: {
                    type: "Point", coordinates: [lon, lat]
                },
                $maxDistance: distance
            }
        },
        'properties.categories': { $all: activity_reg_ex },
        'properties.categories': { $in: activity_reg_ex },
        $or: [
            { 'properties.date': { '$gte': day_start, '$lte': day_end } },
            // TODO: include recuring in a smart way { 'properties.recurs': { $ne: null }}
        ] 
    // Sort by date and then decending orer of ranking score (was likes)
    // TODO: fix sorting on dates, which appear to be inconsistent from the data source
    })
    //.sort('properties.date')
    .sort({ 'properties.score' : -1});

    let query_by_recuring = Event.find({
        'geometry': {
            $nearSphere: {
                $geometry: {
                    type: "Point", coordinates: [lon, lat]
                },
                $maxDistance: distance
            }
        },
        'properties.recurs': { $ne: null }
    })

    query_and_sort_by_likes
        .then(function (results, err) {
            console.log('Got events!', results.length);

            // TODO: Move Sorting Algorithm to server or data pipeline
            results.forEach(result => {
                // console.log(result.properties.title, result.properties.source, result.properties.likes, result.properties.categories);
            });

            return res.json({ success: true, data: results });

        }); 
});

app.get('/api/places', (req, res) => {

    let lat = req.query.lat;
    let lon = req.query.lon;
    let distance = req.query.distance * config.meters_per_mile;
    let activity = req.query.activity;

    console.log('Distance: ', distance, ' activity ', JSON.stringify(activity))

    // This is just the query
    let query = {
        'geometry': {
            $nearSphere: {
                $geometry: {
                    type: "Point", coordinates: [lon, lat]
                },
                $maxDistance: distance
            }
        },
        'properties.categories': { $all: activity },
        'properties.categories': { $in: activity }
    }

    let new_query = { geometry: { $geoWithin: { $centerSphere: [[-122.28615989025315, 37.816508894670264], 0.0003363024865705144] } } }
    let query_by_location = Place.find(query);

    query_by_location
        .then(function (results, err) {
            console.log('Got places!', results.length);

            /* Print each name
            results.forEach(place => {
                console.log(place.name);
            });
            */

            return res.json({ success: true, data: results });

        });
});

app.get('/api/weather', (req, res) => {

    var options = {
        method: 'GET',
        url: 'https://openweathermap.org/data/2.5/weather',
        qs:
        {
            appid: 'b6907d289e10d714a6e88b30761fae22',
            lat: req.query.lat,
            lon: req.query.lon,
            units: 'imperial'
        }
    };

    request(options, function (error, response, body) {
        
        try {
            body = JSON.parse(body)

        } catch (error) {
            error = error;
        }

        if (response.statusCode == '200' && error == null) {
            //return res.json({ success: true, data: JSON.parse(body) }); 
            return res.json({ success: true, data: body  });

        } else {
            console.log(error)
            return res.json({ success: false, data: { error } });
        }
        
    });
    
})

app.post('/api/places', function(req, res) {
    
    let place = req.body
    place.id = place.properties.id;
    console.log('Posted places to be saved: ', place.id, place.properties.name)

    Place.findOneAndUpdate(
        { 'id' : place.id }, // find a document with that filter
        place, // document to insert when nothing was found
        { upsert: true, new: true, runValidators: true }, // options
        function (err, doc) { // callback
            if (err) {
                // handle error
                console.log('Error saving to Mongo: ', err)
                return res.json({ success: false, data: 'Error saving to database.' });
            } else {
                // handle document
                return res.json({ success: true, data: 'Saved to database: ' + doc });
            }
        }
    )
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/client/build/index.html'));
});

// env variables
const PORT = process.env.PORT || 5000;

    // launch our backend into a port
app.listen(PORT, () => console.log(`Server is listenting on ${PORT}`));