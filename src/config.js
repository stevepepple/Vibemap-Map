const mongoose = require('mongoose');

var config = {};

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

/*
{
    "title": "Make: Monthly Artist Happy Hour & Local Vendors | Dogpatch",
        "link": "https://sf.funcheap.com/make-monthly-artist-happy-hour-local-vendors-dogpatch-2/",
        "source": "fun_cheap",
        "date": "Thursday, December 20, 2018",
        "address": "2569 Third Street San Francisco",
        "price": "Cost: $8*",
        "venue": "",
        "start_time": "6:00 pm",
        "end_time": "9:30 pm",
        "likes": 1,
        "image": "https://cdn.funcheap.com/wp-content/uploads/2018/09/Screen-Shot-2018-09-17-at-2.54.31-PM-563x206.png",
        "image_source": "Museum of Craft and Design",
        "description": "Submitted by the Event OrganizerDesign your night at Make. On the third Thursday of each month, collaborate with artists and makers, explore unique themes and rethink materials through creative design projects. Enjoy hands-on art activities and crafts, artist-led happy hours, films, tours, performances and much more. Each month features a different experience and projects.Make: Monthly Artist Happy Hour & Local Vendors\nEvery 3rd Thursday | 6 pm to 9:30 pm\nMuseum of Craft and Design, 2569 Third St, San Francisco\nAdults $8, Students/Senior $6Cash bar for guests over 21 and complimentary drink tickets for MCD members; ID is required. Space and supplies are limited; some events may require a nominal materials fee.",
        "more_details": "Submitted by the Event OrganizerMake: Monthly Artist Happy Hour & Local Vendors\nEvery 3rd Thursday | 6 pm to 9:30 pm\nMuseum of Craft and Design, 2569 Third St, San Francisco\nAdults $8, Students/Senior $6"
}
*/

module.exports = config;