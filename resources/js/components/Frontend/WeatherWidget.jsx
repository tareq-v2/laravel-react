import React, { useState, useEffect } from 'react';
import './Design/WeatherWidget.css';

const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState({
    losAngeles: null,
    yerevan: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = 'fb32a702cfd6f3d98f5b8750a9481bc2';
        
        const [laResponse, yerevanResponse] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=Dhaka&units=imperial&appid=${API_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/weather?q=Yerevan&units=metric&appid=${API_KEY}`)
        ]);

        const [laData, yerevanData] = await Promise.all([
          laResponse.json(),
          yerevanResponse.json()
        ]);

        setWeatherData({
          losAngeles: laData,
          yerevan: yerevanData,
          loading: false,
          error: null
        });

      } catch (err) {
        setWeatherData({
          ...weatherData,
          loading: false,
          error: 'Failed to fetch weather data'
        });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp, timezone) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  };

  if (weatherData.loading) return <div className="weather-loading">Loading weather...</div>;
  if (weatherData.error) return <div className="weather-error">{weatherData.error}</div>;

  return (
    <div className="weather-widget">
      {/* Los Angeles Weather */}
      <div className="weather-card">
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.losAngeles?.weather[0]?.icon}@2x.png`}
          alt={weatherData.losAngeles?.weather[0]?.description}
          className="weather-icon"
        />
        <div className="weather-info">
          <div className="temperature">
            {Math.round(weatherData.losAngeles?.main?.temp)}°F /{' '}
            {Math.round((weatherData.losAngeles?.main?.temp - 32) * 5/9)}°C
          </div>
          <div className="time">
            {formatTime(weatherData.losAngeles?.dt, weatherData.losAngeles?.timezone)}
          </div>
          <div className="location">
            Los Angeles <img 
              src={`https://flagcdn.com/16x12/us.png`} 
              alt="USA flag" 
              className="flag-icon"
            />
          </div>
        </div>
      </div>

      {/* Yerevan Weather */}
      <div className="weather-card">
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.yerevan?.weather[0]?.icon}@2x.png`}
          alt={weatherData.yerevan?.weather[0]?.description}
          className="weather-icon"
        />
        <div className="weather-info">
          <div className="temperature">
            {Math.round(weatherData.yerevan?.main?.temp)}°C /{' '}
            {Math.round((weatherData.yerevan?.main?.temp * 9/5) + 32)}°F
          </div>
          <div className="time">
            {formatTime(weatherData.yerevan?.dt, weatherData.yerevan?.timezone)}
          </div>
          <div className="location">
            Yerevan <img 
              src={`https://flagcdn.com/16x12/am.png`} 
              alt="Armenia flag" 
              className="flag-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;