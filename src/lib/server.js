const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
const router = express.Router();

// Local config
// TODO: This needs to move to a common repo
const config = require('../config');

require('dotenv').config();

// env variables
const PORT = process.env.SERVER_PORT;

console.log(process.env.DATABASE)

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
mongoose.Promise = global.Promise;


let db = mongoose.connection;

db.once("open", () => console.log("Mongo DB  is connected."));

const Event = mongoose.model('Event', config.event_schema);

router.get("/hello", (req, res) => {
    console.log('Responding to request...');
    return res.json({ success: true, data: { hello : 'hello' } });
});

router.get("/events", (req, res) => {

    console.log('Routing with request ...', req.query);

    // TODO: pass number of days as an argument
    let now = moment();
    let tomorrow = moment().add(2, 'days');

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
            '$gte': now,
            '$lte': tomorrow
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

        })
 
    /*
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
    */
});

// append /api for our http requests
app.use("/api", router);

app.use(bodyParser.json());


    // launch our backend into a port
app.listen(PORT, () => console.log(`Server is listenting on ${PORT}`));