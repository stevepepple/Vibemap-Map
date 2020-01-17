module.exports = {
    categories: {
      going_out: '#e31a1c'
    },

    lens : {
      'fill-color': '#007AFF',
      'fill-opacity': 0.4,
      'fill-outline-color': '#007AFF'
    },

    geolocateStyle : {
      position: 'absolute',
      right: 3,
      top: "8em",
      margin: 10,
      width: 30
    },

    /* TODO: this style is not used? 
    places_circle: {
      'circle-radius': [
      'interpolate',
      ['exponential', 10],
      ["zoom"],
      3, ['*', 4, ['to-number', ['get', 'rating']]],
      12, ['*', 20, ['to-number', ['get', 'rating']]],
      18, ['*', 30, ['to-number', ['get', 'rating']]]],

      'circle-color': [
        "case",
        [
          // Going out
          "match",
          ["get", "type2"],
          [ "restaurant", "food", "cafe", "night_club", "bar", "meal_takeaway", "liquor_store", "bakery" ],
          true, false
        ],
        "hsl(336, 60%, 56%)",
        [
          "match",
          ["get", "type1"],
          ["restaurant", "food", "cafe", "bar"],
          true, false
        ],
        "hsl(336, 60%, 56%)",
        // Coming Together
        [
          "match",
          ["get", "type1"],
          ["store", "florist", "home_goods_superstore", "shopping_mall", "bicycle_store", "book_store", "clothing_store", "hardware_store", "shoe_store", "movie_rental", "department_store", "furniture_store", "grocery_or_supermarket", "supermarket", "electronics_store", "convenience_store", "pet_store" ],
          true, false
        ],
        "hsl(322, 57%, 62%)",
        [
          // Transit
          "match",
          ["get", "type1"],
          [ "bus_station", "transit_station" ],
          true, false
        ],
        "hsl(226, 50%, 53%)",
        [
          // Going outside
          "match",
          ["get", "type2"],
          [ "natural_feature", "park", "cemetery" ],
          true, false
        ],
        "hsl(154, 57%, 53%)",
        // Living Here
        [
          "match",
          ["get", "type1"],
          ["school", "layer"],
          true, false
        ],
        "hsl(27, 59%, 64%)",
        [
          "match",
          ["get", "type2"],
          [ "gym", "beauty_salon", "lodging", "school", "home_goods_store", "plumber", "storage" ],
          true, false
        ],
        "hsl(27, 59%, 64%)",
        // Community
        [
          "match",
          ["get", "type1"],
          ["church", "local_government_office", "political", "place_of_worship", "police"],
          true,
          false
        ],
        "hsl(270, 61%, 50%)",
        [
          "match",
          ["get", "type2"],
          [ "church", "local_government_office", "political", "police" ],
          true,
          false
        ],
        "hsl(270, 61%, 50%)",
        // Community
        [
          "match",
          ["get", "type1"],
          [ "health", "doctor", "physiotherapist", "church", "university", "neighborhood", "mosque", "synagogue", "library" ],
          true,
          false
        ],
        "hsl(263, 60%, 55%)",
        [
          "match",
          ["get", "type1"],
          ["point_of_interest", "lodging", "home_goods", "gym"],
          true,
          false
        ],
        "hsl(19, 62%, 63%)",
        "hsl(301, 7%, 67%)"
      ],
      'circle-stroke-color': 'white',
      'circle-stroke-width': {
        stops: [
        [12, 0.5],
        [18, 4.0]] },

      'circle-opacity': {
        stops: [[10, 0.0], [12, 0.4], [13, 0.6], [18, 1.0]] },

      'circle-stroke-opacity': {
        stops: [[10, 0.0], [12, 0.4], [13, 0.6], [18, 1.0]] }
    },
    */
    marker_layout :  {
      // Icon Style
      "icon-image": ["to-string", ["get", "categories"]],
      //"icon-padding": 1,
      "icon-size": [
        "case",
        [">", ["get", "aggregate_rating"], 4.9],
        0.7,
        [">", ["get", "aggregate_rating"], 3.9],
        0.6,
        [">", ["get", "aggregate_rating"], 3],
        0.4,
        // Fall back value
        0.2
      ],
      // TODO: Make sure important sorting variable is working
      "symbol-sort-key": ["get", "aggregate_rating"],
      // Text
      "text-field": ["to-string", ["get", "name"]],
      "text-allow-overlap": false,
      "icon-allow-overlap": true,
      "text-font": ["Roboto Regular"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 4,
        22, 16
      ],
      "text-offset": [0, -1.2],
      "text-max-width": 12      
    },

    marker_paint: { 
      'text-color': '#742395',
      'text-halo-color': '#FFFFFF',
      'text-halo-width' : 1.2
    },

    top_pick_layout: {
      // TODO: Make sure important sorting variable is working
      "symbol-sort-key": ["get", "aggregate_rating"],
      // Text
      "text-field": ["to-string", ["get", "name"]],
      "text-allow-overlap": false,
      "text-font": ["Roboto Medium"],
      "text-justify": "center",
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 6,
        22, 20
      ],
      "text-offset": [0, -2],
      "text-max-width": 12
    },

    top_pick_paint: {
      'text-color': '#811897',
      'text-halo-color': '#FFFFFF',
      'text-halo-width': 1.2
    },

    top_vibe_layout: {
      // TODO: Make sure important sorting variable is working
      "symbol-sort-key": ["get", "aggregate_rating"],
      // Text
      "text-field": ["to-string", ["get", "top_vibe"]],
      "text-allow-overlap": false,
      "text-font": ["Roboto Regular"],
      "text-justify" : "center",
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 6,
        22, 20
      ],
      "text-offset": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["literal", [0, 2]],
        22,
        ["literal", [0, 5]]
      ],
      "text-max-width": 12
    },

    places_heatmap: {
      'heatmap-radius' : [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 1,
          10, 20,
          12, 40,
          13, 50,
          14, 70,
          20, 200
      ],
      'heatmap-opacity': [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 0.2,
          12, 0.2,
          20, 0.4
      ],
      // TODO: Scale this on the total number of results vs. size of area...
      'heatmap-intensity': [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 0.4,
          12, 0.2,
          14, 0.25,
          20, 0.4
      ],
      /*
      TODO: One of these approaches should work...
      'heatmap-weight': {
        property: 'aggregate_rating',
        type: 'linear',
        stops: [
          [0, 1],
          [1, 10]
        ]
      },
      
      "heatmap-weight": [
        [
          "interpolate",
          ["linear"],
          ["get", "aggregate_score"],
          1, 0.1,
          5, 1
        ]
      ],
      */
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0.2,
        "hsla(240, 80%, 94%, 0)",
        0.3,
        "hsla(286, 100%, 50%, 0.2)",
        0.5,
        "hsla(179, 100%, 50%, 0.6)",
        0.95,
        "hsla(50, 100%, 50%, 0.9)",
        /* The pink is too much? */
        1.2,
        "hsla(25, 100%, 50%, 0.8)" 
      ]
    },

    tile_layer_layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },

    tile_layer_paint: {
        'line-opacity': 0.6,
      'line-color': 'rgb(53, 175, 109)',
      'line-width': 2
    },

    places_cluster: {
      //   * Blue, 20px circles when point count is less than 100
      //   * Yellow, 30px circles when point count is between 100 and 750
      //   * Pink, 40px circles when point count is greater than or equal to 750
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1"
      ],
      'circle-opacity': 0.2,
      'circle-stroke-color': '#FFFFFF',
      'circle-stroke-width': 2.4,
      'circle-radius': {
        property: 'point_count',
        type: 'interval',
        stops: [
          [0, 60],
          [100, 80],
          [750, 160]
        ]
      } 
    },

    events_circle: {
      // increase the radius of the circle as the zoom level and dbh value increases
      'circle-radius': {
        'base': 8,
        'stops': [[8, 4], [18, 20]] },
        'circle-color': '#C650CC',
        'circle-stroke-color': '#CC9423',
        'circle-stroke-width': 0.4,
        'circle-opacity': {
          'stops': [[8, 0.1], [20, 0.6]]
        },
        'circle-translate': [-2, -2]
    },

    places_circle: {
      // increase the radius of the circle as the zoom level and dbh value increases
      'circle-radius': [
        "case",
        [">=", ["get", "aggregate_rating"], 3],
        2,
        [">=", ["get", "aggregate_rating"], 4],
        4,
        [">=", ["get","aggregate_rating"], 5],
        10,
        2
      ],
      'circle-color': "#e27012",
      'circle-stroke-color': '#FFFFFF',
      'circle-stroke-width': 0.4,
      'circle-opacity': {
        'stops': [[8, 0.2], [20, 0.2]]
      },
      'circle-translate': [-2, -2]
    }
}
