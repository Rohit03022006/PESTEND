import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog,
  WiDayCloudy, WiNightClear, WiNightCloudy, WiShowers,
  WiDaySunnyOvercast, WiHumidity, WiStrongWind,
  WiBarometer, WiRefresh, WiCloudRefresh, WiDirectionUp
} from "react-icons/wi";
import { 
  FiNavigation, FiRefreshCw, FiMapPin, FiAlertCircle 
} from "react-icons/fi";

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "a184b7ca5251fded5280c53447dc2ba2";

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const getUserLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocation({ lat: 28.6861, lon: 77.3260 });
        setError("Using default location. Enable location access for accurate weather data.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const fetchWeatherData = async () => {
    if (!location) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
      );

      setWeatherData(response.data);

    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Weather API unavailable. Showing sample data.");
      setWeatherData(getFallbackWeatherData());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackWeatherData = () => {
    const baseTemp = 28 + (Math.random() * 8 - 4);
    const temp_min = Math.round(baseTemp - 3 - Math.random() * 3);
    const temp_max = Math.round(baseTemp + 3 + Math.random() * 3);
    
    const weatherTypes = [
      { icon: '01d', desc: 'clear sky', pop: 10 },
      { icon: '02d', desc: 'few clouds', pop: 20 },
      { icon: '03d', desc: 'scattered clouds', pop: 30 },
      { icon: '04d', desc: 'broken clouds', pop: 40 },
      { icon: '09d', desc: 'shower rain', pop: 70 },
      { icon: '10d', desc: 'rain', pop: 60 },
    ];
    
    const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    
    return {
      dt: Date.now() / 1000,
      main: {
        temp: (temp_min + temp_max) / 2,
        temp_min: temp_min,
        temp_max: temp_max,
        humidity: 50 + Math.floor(Math.random() * 30),
        pressure: 1010 + Math.floor(Math.random() * 10),
      },
      weather: [{
        description: weather.desc,
        icon: weather.icon,
      }],
      wind: {
        speed: (3 + Math.random() * 5).toFixed(1),
        deg: Math.floor(Math.random() * 360)
      },
      pop: weather.pop,
    };
  };

  const getWeatherIcon = (iconCode, size = "3.5rem") => {
    const iconProps = { size: size, className: "text-blue-600" };
    
    const iconMap = {
      '01d': <WiDaySunny {...iconProps} />,
      '01n': <WiNightClear {...iconProps} />,
      '02d': <WiDayCloudy {...iconProps} />,
      '02n': <WiNightCloudy {...iconProps} />,
      '03d': <WiCloudy {...iconProps} />,
      '03n': <WiCloudy {...iconProps} />,
      '04d': <WiCloudy {...iconProps} />,
      '04n': <WiCloudy {...iconProps} />,
      '09d': <WiShowers {...iconProps} />,
      '09n': <WiShowers {...iconProps} />,
      '10d': <WiRain {...iconProps} />,
      '10n': <WiRain {...iconProps} />,
      '11d': <WiThunderstorm {...iconProps} />,
      '11n': <WiThunderstorm {...iconProps} />,
      '13d': <WiSnow {...iconProps} />,
      '13n': <WiSnow {...iconProps} />,
      '50d': <WiFog {...iconProps} />,
      '50n': <WiFog {...iconProps} />
    };
    
    return iconMap[iconCode] || <WiDaySunnyOvercast {...iconProps} />;
  };

  const getWindDirectionIcon = (degrees) => {
    return (
      <div className="inline-flex items-center">
        <WiDirectionUp 
          size="1rem" 
          className="text-gray-500"
          style={{ transform: `rotate(${degrees}deg)` }}
        />
      </div>
    );
  };

  if (locationLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-32 flex-col">
          <FiRefreshCw className="animate-spin text-blue-600 mb-2" size="2rem" />
          <p className="text-sm text-gray-600">Detecting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <WiDaySunny className="text-blue-600 mr-2" size="1.5rem" />
            Current Weather
          </h2>
          {location && (
            <div className="text-sm text-gray-600 flex items-center mt-1">
              <FiMapPin size="0.9rem" className="mr-1" />
              {location.lat.toFixed(4)}°N, {location.lon.toFixed(4)}°E
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={getUserLocation}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Refresh location"
          >
            <FiNavigation size="1.2rem" />
          </button>
          <button
            onClick={fetchWeatherData}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Refresh weather"
          >
            <FiRefreshCw size="1.2rem" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4 text-sm flex items-center">
          <FiAlertCircle className="mr-2" size="1rem" />
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <FiRefreshCw className="animate-spin text-blue-600" size="2rem" />
        </div>
      ) : (
        <>
          {weatherData && (
            <div className="rounded-lg p-4 text-center">
              <h3 className="font-bold text-gray-800 text-3xl mb-2">
                Today
              </h3>
              <div className="text-m text-gray-500 mb-3">
                {new Date(weatherData.dt * 1000).toLocaleDateString()}
              </div>
              
              <div className="my-3 flex justify-center">
                {getWeatherIcon(weatherData.weather[0].icon, "4rem")}
              </div>
              
              <div className="text-2xl font-bold text-gray-700 mb-2">
                {Math.round(weatherData.main.temp)}°C
              </div>
              
              <div className="text-sm text-gray-600 capitalize mb-4">
                {weatherData.weather[0].description}
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center text-blue-600 mb-1">
                    <WiRain size="1.2rem" className="mr-1" />
                    Precipitation
                  </div>
                  <div className="font-semibold">
                    {weatherData.pop ? Math.round(weatherData.pop) : '0'}%
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center text-gray-500 mb-1">
                    <WiHumidity size="1.2rem" className="mr-1" />
                    Humidity
                  </div>
                  <div className="font-semibold">
                    {weatherData.main.humidity}%
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center text-gray-500 mb-1">
                    <WiStrongWind size="1.2rem" className="mr-1" />
                    Wind
                  </div>
                  <div className="font-semibold flex items-center justify-center">
                    {weatherData.wind.speed} m/s
                    {getWindDirectionIcon(weatherData.wind.deg)}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-center text-gray-500 mb-1">
                    <WiBarometer size="1.2rem" className="mr-1" />
                    Pressure
                  </div>
                  <div className="font-semibold">
                    {weatherData.main.pressure} hPa
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 text-center flex items-center justify-center mt-4">
            <WiRefresh size="1rem" className="mr-1" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </>
      )}
    </>
  );
};

export default WeatherForecast;
