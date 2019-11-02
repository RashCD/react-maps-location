import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { convertCelsius } from './utils/converter';
import { fetchMapLocation, fetchWeatherLocation } from './queries';
import search from './icon/search.svg';
import close from './icon/close.svg';

const INITIAL_STATE = {
  zoom: 10,
  geoLocation: { lat: 3.139003, lng: 101.686852 },
};

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedMarker, setSelectedMarker] = useState(false);
  const [weatherResponse, setWeatherResponse] = useState({});
  const [mapState, setMapState] = useState(INITIAL_STATE);

  useEffect(() => {
    weatherLocationCallback(mapState.geoLocation);
  }, [mapState.geoLocation]);

  const fetchMapLocationCallback = () => {
    return fetchMapLocation(searchInput).then(response => {
      if (response.results.length) {
        setMapState(prev => ({
          ...prev,
          zoom: 15,
          geoLocation: response.results[0].geometry.location,
        }));
      } else {
        alert('No result from your search');
      }
    });
  };

  const weatherLocationCallback = coordinates => {
    return fetchWeatherLocation(coordinates.lat, coordinates.lng).then(response =>
      setWeatherResponse(response)
    );
  };

  const resetSearch = () => {
    setMapState(INITIAL_STATE);
    setSearchInput('');
    setSelectedMarker(false);
  };

  return (
    <div className="App">
      <div className="top">
        <div className="search md-whiteframe-24dp">
          <input
            type="text"
            className="search-input"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchMapLocationCallback()}
          />
          {!searchInput.length ? (
            <button className="button" onClick={fetchMapLocationCallback}>
              <img alt="search" src={search} className="icon" />
            </button>
          ) : (
            <button className="button" onClick={resetSearch}>
              <img alt="close" src={close} className="icon" />
            </button>
          )}
        </div>
      </div>
      <LoadScript id="script-loader" googleMapsApiKey={`${process.env.REACT_APP_GOOGLE_KEY}`}>
        <GoogleMap id="example-map" zoom={mapState.zoom} center={mapState.geoLocation}>
          <Marker
            position={mapState.geoLocation}
            onClick={() => setSelectedMarker(true)}
            animation={2}
          />
          {selectedMarker && (
            <InfoWindow
              position={mapState.geoLocation}
              onCloseClick={() => setSelectedMarker(false)}
            >
              <div className="weather">
                {!!Object.keys(weatherResponse).length && (
                  <>
                    <p className="weather-type">Weather Reports</p>
                    <span className="weather-title">{weatherResponse.name}</span>
                    <div className="weather-temp">
                      <p>{convertCelsius(weatherResponse.main.temp)}</p>
                      <p>&deg;C</p>
                    </div>
                    <div className="weather-subtitle">{weatherResponse.weather[0].description}</div>
                    <div className="weather-description">
                      <div>Min: {convertCelsius(weatherResponse.main.temp_min)}&deg;C</div>
                      <div>Max: {convertCelsius(weatherResponse.main.temp_max)}&deg;C</div>
                      <div>Humid: {weatherResponse.main.humidity}</div>
                      <div>Pressure: {weatherResponse.main.pressure}</div>
                    </div>
                  </>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
