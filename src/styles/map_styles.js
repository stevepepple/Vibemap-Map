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
      top: 1,
      margin: 10,
      width: 30
    },

    navigateStyle: {
      top: 3
    },

    top_marker: {
      // Icon Style
      "icon-size": [
        "interpolate",
        ["linear"], ["zoom"],
        8, 0.4,
        16, 1,
        22, 40
      ],
    },

    marker_layout :  {
      // Icon Style
      "icon-image": ["to-string", ["get", "categories"]],
      "icon-padding": 4.0,
      "icon-size": [
        "case",
        [">", ["get", "average_score"], 4.9],
        1.0,
        [">", ["get", "average_score"], 3.5],
        0.8,
        [">", ["get", "average_score"], 2],
        0.6,
        // Fall back value
        0.4
      ],
      // TODO: Make sure important sorting variable is working
      "symbol-sort-key": ["get", "average_score"],
      // Text
      "text-field": [
        "case",
        [">", ["get", "average_score"], 3.0],
        ["to-string", ["get", "short_name"]],
        // Fallback value
        ""
      ],
      //"text-field": ["to-string", ["get", "top_vibe"]],
      "text-allow-overlap": false,
      "icon-allow-overlap": false,
      "icon-ignore-placement": false,
      "text-ignore-placement": false,
      "text-line-height": 1.0,
      "text-anchor": "bottom",
      "text-font": ["Roboto Condensed"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 4,
        22, 16
      ],
      "text-offset": [0, -1.0],
      "text-padding": 2,
      "text-max-width": 10,
      'visibility': 'visible' 
    },

    marker_paint: { 
      'text-color': '#7D7C84',
      'icon-color': '#3475BA',
      'text-halo-color': '#FFFFFF',
      'text-halo-width' : 1.2
    },

    route_layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },

    route_paint: {
      'line-color': '#3887be',
      'line-width': 5,
      'line-opacity': 0.75
    },

    top_pick_layout: {
      // TODO: Make sure important sorting variable is working
      //"icon-image": "",
      "icon-image": ["to-string", ["get", "categories"]],
      "icon-size": [
        "interpolate",
        ["linear"],["zoom"],
        8, 0.4,
        22, 2
        // 22, ["get", "icon_size"]
      ],
      "symbol-sort-key": ["get", "average_score"],
      // Text
      "text-field": [
        "match", 
        ["get", "top_in_cluster"], 
        ["false"], 
        "",
        ["to-string", ["get", "short_name"]]
      ],
      "text-allow-overlap": false,
      "icon-allow-overlap": false,
      "icon-ignore-placement": false,
      "text-ignore-placement": false,
      "text-radial-offset" : [
        "interpolate",
        ["linear"], ["zoom"],
        8, 0.6,
        12, ["-", ["get", "icon_size"], 0],
        15, ["+", ["get", "icon_size"], 0],
        20, ["+", ["get", "icon_size"], 0.2]
      ],
      "text-font": ["Roboto Condensed Bold"],
      "text-line-height": 1.0,
      "text-letter-spacing": 0,
      "text-anchor" : "bottom",
      "text-justify": "center",
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 8,
        22, 22
      ],
      "text-max-width": 10,
      'visibility': 'visible'
    },

    neighborhood_layout: {
      "text-size": { 
        "base": 1, 
        "stops": [[10, 8], [18, 12]] 
      },  
      "text-transform": "uppercase",
      "text-padding": 1,      
      "text-field": [
        "to-string",
        ["get", "neighborhood"]
      ],
      "text-font": ["Public Sans Bold"],
      "text-letter-spacing": 0.1,
      "text-allow-overlap": true,
      "text-ignore-placement": true,
      "text-max-width": 8,
      "visibility" : "visible"
    },

    neighborhood_paint: {
      "text-halo-color": "hsla(295, 100%, 100%, 0.8)",
      "text-halo-width": 1,
      "text-color": "hsl(253, 50%, 47%)",
      //"text-halo-blur": 0.6,
      //"text-opacity": 0.33
    },

    top_pick_paint: {
      'text-color': '#222222',
      'text-halo-color': '#FFFFFF',
      'text-halo-width': 1.4
    },

    top_vibe_layout: {
      // Text
      "text-field": [
        // Dont show labels for clustered markers
        //["match", ["get", "top_in_cluster"], [true], null],
        "to-string", ["get", "top_vibe"]
      ],
      "text-font": ["Roboto Condensed Italic"],
      "text-justify" : "center",
      "text-anchor": "bottom",
      "text-allow-overlap": false,
      "icon-allow-overlap": false,
      "icon-ignore-placement": true,
      "text-ignore-placement": true,
      "symbol-sort-key": ["get", "average_score"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 6,
        22, 20
      ],
      "text-radial-offset": [
        "interpolate",
        ["linear"], ["zoom"],
        8, 0.4,
        12, ["-", ["get", "icon_size"], 1.3],
        15, ["-", ["get", "icon_size"], 1.0],
        18, ["-", ["get", "icon_size"], 1.6]
      ],
      "text-max-width": 12
    },

    places_heatmap: {      
      'heatmap-radius' : [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 1,
          10, 16,
          12, 30,
          13, 40,
          14, 60,
          20, 200
      ],
      'heatmap-opacity': [
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 0.3,
          11, 0.3,
          20, 0.3
      ],
      // This number is adjusted by React based on the relative density of the map area
      'heatmap-intensity' : 0.2,
      /*
      'heatmap-intensity': [        
        "interpolate",
        ["linear"],
        ["zoom"],
          8, 0.8,
          10, 0.3,
          12, 0.1,
          14, 0.3,
          20, 0.5
      ],
      */
      
      // TODO: this should be average_score from backend vibe score
      "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["get", "aggregate_rating"],
          1, 0.2,
          5, 1
      ],
      
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0.1,
        "hsla(240, 80%, 94%, 0)",
        // Replaced by heatmap.fifth
        0.2,
        "hsla(125, 63%, 88%, 0.2)",
        // Replaced by heatmap.fourth
        0.4,
        "hsla(192, 84%, 80%, 0.4)",
        // Replaced by heatmap.third
        0.7,
        "hsla(274, 100%, 65%, 0.5)",
        // Replaced by heatmap.second
        0.95,
        "hsla(300, 100%, 50%, 0.6)",
        // Replaced by heatmap.first
        1.1,
        "hsla(42, 100%, 64%, 0.6)",
        /* The pink is too much? 
        1.2,
        "hsla(42, 88%, 65%, 0.9)"
        */
      ]
    },

    /*
    tile_layer_layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },

    tile_layer_paint: {
      'line-opacity': 0.6,
      'line-color': 'rgb(53, 175, 109)',
      'line-width': 2
    },
    */

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
