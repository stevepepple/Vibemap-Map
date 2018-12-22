const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');
const path = require('path');


const app = express();

// Local config
// TODO: This needs to move to a common repo
const config = require('./config');

require('dotenv').config();


mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;

db.once("open", () => console.log("Mongo DB  is connected."));

const Event = mongoose.model('Event', config.event_schema);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use(express.static(path.join(__dirname, 'client/build')));
//app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
    console.log('Responding to request...');
    return res.json({ success: true, data: { hello : 'hello' } });
});

app.get('/api/events', (req, res) => {

    console.log('Routing with request ...', req.query);

    // TODO: pass number of days as an argument
    let day_start = moment();
    console.log('Number of days: ', req.query.num_days)
    let day_end = moment().add(req.query.num_days, 'days');

    let lat = req.query.lat;
    let lon = req.query.lon;
    let distance = req.query.distance * config.meters_per_mile;

    let query_and_sort_by_likes = Event.find({
        'geometry': {
            $nearSphere: {
                $geometry: {
                    type: "Point", coordinates: [lon, lat]
                },
                $maxDistance: distance
            }
        },
        'properties.date': {
            '$gte': day_start,
            '$lte': day_end
        }
    }).sort('properties.likes');

    query_and_sort_by_likes
        .then(function (results, err) {
            console.log('Got places!');

            results = results.reverse();

            results.forEach(result => {
                console.log(result.properties.title, result.properties.source, result.properties.likes);
            });

            return res.json({ success: true, data: results });

        }); 
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/client/build/index.html'));
});

// env variables
const PORT = process.env.PORT || 5000;

    // launch our backend into a port
app.listen(PORT, () => console.log(`Server is listenting on ${PORT}`));