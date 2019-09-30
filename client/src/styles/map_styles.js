module.exports = {
    categories: {
      going_out: '#e31a1c'
    },

    lens : {
      'line-color': '#007AFF',
      'line-opacity': 0.6,
      'line-width': 2
    },

    geolocateStyle : {
      position: 'absolute',
      right: 3,
      top: "8em",
      margin: 10,
      width: 30
    },

    // TODO: this style is not used? 
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
 
    marker_layout :  {
      "visibility": "visible",
      "text-field": ["to-string", ["get", "name"]],
      "text-allow-overlap" : true,
      "text-offset": [0, -2],
      "icon-image": [
        "step",
        ["zoom"],
        ["to-string", ["get", "categories"]],
        22,
        ["to-string", ["get", "categories"]]
      ],
      "text-size": 10,
      "icon-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        0.1,
        22,
        1.4
      ]
    },

    marker_paint: { 
      "text-opacity": ["step", ["zoom"], 0, 16, 1, 22, 1]
    },

    places_heatmap: {
      'heatmap-radius' : [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 1,
          10, 6,
          12, 30,
          13, 50,
          14, 80,
          20, 130
      ],
      'heatmap-opacity': [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 0.2,
          12, 0.3,
          15, 0.4
      ],
      // TODO: Scale this on the total number of results vs. size of area...
      'heatmap-intensity': [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 0.1,
          14, 0.25,
          20, 0.4
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0.2,
        "hsla(240, 80%, 94%, 0)",
        0.3,
        "hsla(286, 100%, 50%, 0.2)",
        0.6,
        "hsla(179, 100%, 50%, 0.6)",
        0.95,
        "hsla(50, 100%, 50%, 0.9)",
        /* The pink is too much? */
        1.2,
        "hsla(25, 100%, 50%, 0.8)"
        
      ]
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
        'base': 3,
        'stops': [[8, 1], [18, 20]] },
        'circle-color': '#C650CC',
        'circle-stroke-color': '#CC9423',
        'circle-stroke-width': 0.4,
        'circle-opacity': {
          'stops': [[8, 0.1], [20, 0.6]]
        },
        'circle-translate': [-2, -2]
    }
}
