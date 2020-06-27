export default function reducer(state = {}, action) {
    switch (action.type) {
      case "FETCH_NEWS_SUCCESS":
        return { ...state, news: action.payload };

      case "FETCH_CITIES_SUCCESS":
        console.log('REDUCER got cities: ', action.payload)
        return { ...state, cities: action.payload };
  
      default:
        return state;
    }
}