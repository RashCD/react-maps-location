export const fetchMapLocation = async locationName => {
  return await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${locationName},&key=${process.env.REACT_APP_GOOGLE_KEY}`
  )
    .then(res => res.json())
    .catch(error => {
      throw new Error(error);
    });
};

export const fetchWeatherLocation = async (lat, lng) => {
  return await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.REACT_APP_WEATHER_KEY}`
  )
    .then(res => res.json())
    .catch(error => {
      throw new Error(error);
    });
};
