import "isomorphic-fetch";

import VibeMap from '../../services/VibeMap.js'

const requestNews = () => ({ type: "FETCH_NEWS_REQUEST" });
const receivedNews = news => ({ type: "FETCH_NEWS_SUCCESS", payload: news });
const newsError = () => ({ type: "FETCH_NEWS_FAILURE" });

const requestCities = () => ({ type: "CITIES_LOADING" });
const receivedCities = cities => ({ type: "CITIES_SUCCESS", payload: cities });
const citiesError = () => ({ type: "CITIES_ERROR" });

const detailsRequest = () => ({ type: "DETAILS_LOADING" });
const detailsReceived = details => ({ type: "DETAILS_SUCCESS", payload: details });
const detailsError = () => ({ type: "FETCH_DETAILS_FAILURE" });


// Async Actions
export const fetchNews = () => (dispatch, getState) => {
  dispatch(requestNews());
  return fetch("http://localhost:3000/api/news")
    .then(response => response.json())
    .then(news => dispatch(receivedNews(news)))
    .catch(err => dispatch(newsError(err)));
};

export const fetchCities = () => (dispatch, getState) => {
  dispatch(requestCities())

  VibeMap.getCities()
    .then(response => response.data)
    .then(cities => {
      dispatch(receivedCities(cities))
      return cities
    })
    .catch(err => dispatch(citiesError(err)))
};

export const fetchDetails = (id, type) => (dispatch, getState) => {
  dispatch(detailsRequest())

  VibeMap.getPlaceDetails(id, type)
    .then(response => response.data)
    .then(details => {
      console.log('DISPATCH DETAILS RECIEVED: ', details.properties)
      dispatch(detailsReceived(details))
      return details
    })
    .catch(err => dispatch(detailsError(err)))

};
