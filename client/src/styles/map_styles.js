module.exports = {
    categories: {
      going_out: '#e31a1c'
    },
    places_circle: {
      'circle-radius': [
      'interpolate',
      ['exponential', 10],
      ["zoom"],
      3, ['*', 0.5, ['to-number', ['get', 'rating']]],
      12, ['*', 1, ['to-number', ['get', 'rating']]],
      18, ['*', 50, ['to-number', ['get', 'rating']]]],

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
    places_heatmap: {
      'heatmap-radius' : [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 4,
          10, 14,
          12, 18
      ],
      'heatmap-opacity': [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 0.8,
          14, 0.4
      ],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
          0, 'rgba(0,255,255, 0)',
          0.2, 'rgba(227,255,207, 0.4)',
          0.3, '#ffff80',
          0.6, '#d6a983',
          0.8, '#9d6697',
          1, '#603583'
        ]
    },
    events_circle: {
      // increase the radius of the circle as the zoom level and dbh value increases
      'circle-radius': {
        'base': 3,
        'stops': [[8, 4], [18, 20]] },

        'circle-color': '#4F94CD',
        'circle-stroke-color': '#2D43B4',
        'circle-stroke-width': 0.6,
        'circle-opacity': 0.2,
        'circle-translate': [-2, -2]
    }
}
