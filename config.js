const mongoose = require('mongoose');

var config = {};

config.database = 'mongodb://stevepepple:Hotspot1@ds019101.mlab.com:19101/hotspots'

config.radius_5 = (5 / 3963.2);
config.meters_per_mile = 1609.34;

config.venues_file = '../data/places/venues.json';
config.combined_geojson = '../data/events/events_combined.geojson';
config.event_classifier = '../data/event_classifier.json';

config.geocoding_options = {
    provider: 'google', // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: 'AIzaSyC2IfNJpGR6qcaOsgacTLVYuF4tqJ7HejY', // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
}

config.eventful_options = {
    method: 'GET',
    url: 'http://api.eventful.com/json/events/search',
    qs:
    {
        app_key: 'cwd9s8tNrb5bkMHq',
        location: 'Oakland',
        date: 'November',
        date: 'This Week',
        page_size: '250',
        category: 'music',
        page_number: '1'
    },
    headers:
    {
        'Postman-Token': '710e6c25-b44b-40f0-a901-826fa7a70e55',
        'cache-control': 'no-cache'
    }
};

config.venue_schema = {
    type: String,
    name: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'    
        }
    },
    properties: {
        name: String,
        address: String
    }
};

config.event_schema = {
    type: String,
    name: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    properties: {
        title: String,
        link: String,
        description: String,
        categories: [{ type: String }],
        address: String,
        neighborhood: String,
        date: Date,
        start_time: String,
        end_time: String,
        likes: { type: Number, default: 0 },
        venue: String,
        venue_id: { type: mongoose.Types.ObjectId, ref: 'Venue' },
        event_link: { type: String, default: null},
        price: String,
        organizer: String,
        image: String,
        image_source: String,
        more_details: String,
        recurs: { type: String, default: null },
        source: String
    }
};

config.place_schema = {
    id: String,
    name: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    // TODO: Add additional attributes like hours, rating, etc. 
    properties: {
        id: String,
        name: String,
        has_details: Boolean,
        description: String,
        categories: [{ type: String }],
        address: String,
        neighborhood: String,
        contact: mongoose.Schema.Types.Mixed,
        hours: mongoose.Schema.Types.Mixed,
        stats: mongoose.Schema.Types.Mixed,
        beenHere: mongoose.Schema.Types.Mixed,
        price: mongoose.Schema.Types.Mixed,
        photos: mongoose.Schema.Types.Mixed,
        likes: Number,
        createdAt: String,
        url: String,
        tips: [{ type: String }],
    }
}

module.exports = config;