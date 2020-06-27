import "isomorphic-fetch";

import VibeMap from '../../services/VibeMap.js'


const requestNews = () => ({ type: "FETCH_NEWS_REQUEST" });
const requestCities = () => ({ type: "FETCH_CITIES_REQUEST" });

const receivedNews = news => ({ type: "FETCH_NEWS_SUCCESS", payload: news });
const receivedCities = cities => ({ type: "FETCH_CITIES_SUCCESS", payload: cities });


const citiesError = () => ({ type: "FETCH_CITEIS_FAILURE" });
const newsError = () => ({ type: "FETCH_NEWS_FAILURE" });

// Async Actions
export const fetchNews = () => (dispatch, getState) => {
  dispatch(requestNews());
  return fetch("http://localhost:3000/api/news")
    .then(response => response.json())
    .then(news => dispatch(receivedNews(news)))
    .catch(err => dispatch(newsError(err)));
};

export const fetchCities = () => (dispatch, getState) => {
  dispatch(requestCities());
  return VibeMap.getCities()
    .then(response => response.json())
    .then(cities => dispatch(receivedCities(cities)))
    .catch(err => dispatch(citiesError(err)));
};


