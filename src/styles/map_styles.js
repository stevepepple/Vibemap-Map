module.exports = {
    places_circle: {
      'circle-radius': [
      'interpolate',
      ['exponential', 3],
      ["zoom"],
      3, ['*', 0.5, ['to-number', ['get', 'rating']]],
      12, ['*', 1, ['to-number', ['get', 'rating']]],
      18, ['*', 10, ['to-number', ['get', 'rating']]]],

      'circle-color': 'rgb(121, 76, 138)',
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
