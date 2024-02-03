import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  TiWeatherCloudy,
  TiWeatherDownpour,
  TiWeatherNight,
  TiWeatherPartlySunny,
  TiWeatherSunny,
} from "react-icons/ti";
import { FaWind } from "react-icons/fa";
import { Card, CardContent, Typography, Grid, TextField, Button } from "@mui/material";
import loader from "./../images/WeatherIcons.gif";

import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [loading, setLoading] = useState(false);

  const API_KEY = "5ef512c22833885fb633682659feab54";

  const fetchWeatherData = useCallback(async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude || ""}&lon=${longitude || ""}&q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude || ""}&lon=${longitude || ""}&q=${city}&units=metric&appid=${API_KEY}`
      );

      const nextFiveDays = forecastResponse.data.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5);

      setForecastData({ list: nextFiveDays });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    if (!city && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [city, fetchWeatherData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const getWeather = () => {
    if (city.trim() !== "") {
      setLoading(true);
      fetchWeatherData();
    }
  };

  return (
    <div className="weather-container">
      {loading && <img src={loader} style={{ width: "10%" }} alt="Loading..." />}
      <h1>Weather Dashboard - {new Date().toLocaleDateString()} {currentTime}</h1>

      {!loading && weatherData ? (
        <Card style={{ alignItems: "center", justifyContent: "center", margin: "50px", height: "25vh", backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
          <CardContent>
            <Typography variant="h6">
              {weatherData.name}, {weatherData.sys.country}
            </Typography>
            <Typography>Temperature: {weatherData.main.temp}°C</Typography>
            <Typography>Humidity: {weatherData.main.humidity}%</Typography>
            <Typography>Pressure: {weatherData.main.pressure} hPa</Typography>
            <Typography>
              Wind: {weatherData.wind.speed} m/s <FaWind />
            </Typography>
            {weatherData.rain && (
              <Typography>
                Rain: {weatherData.rain["1h"]} mm <TiWeatherDownpour />
              </Typography>
            )}
            <Typography>Description: {weatherData.weather[0].description}</Typography>
            {weatherData.weather[0].icon === "01d" && <TiWeatherSunny />}
            {weatherData.weather[0].icon === "01n" && <TiWeatherNight />}
            {weatherData.weather[0].icon === "02d" && <TiWeatherPartlySunny />}
            {weatherData.weather[0].icon === "02n" && <TiWeatherPartlySunny />}
            {weatherData.weather[0].icon === "03d" && <TiWeatherCloudy />}
            {weatherData.weather[0].icon === "03n" && <TiWeatherCloudy />}
            {weatherData.weather[0].icon === "04d" && <TiWeatherCloudy />}
            {weatherData.weather[0].icon === "04n" && <TiWeatherCloudy />}
          </CardContent>
        </Card>
      ) : !loading && <Typography variant="h6">No city found</Typography>}

      <TextField
        label="Enter City"
        variant="outlined"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        InputLabelProps={{ style: { color: "white" } }}
        InputProps={{ style: { color: "white", borderColor: "white" } }}
      />

      <Button
        variant="contained"
        onClick={getWeather}
        style={{ marginLeft: "10px", height: "55px", marginBottom: "30px" }}
      >
        Get Weather
      </Button>

      {!loading && forecastData && (
        <Grid container spacing={2}>
          {forecastData.list.map((item, index) => (
            <Grid item key={index}>
              <Card
                style={{
                  margin: "20px",
                  width: "16vw",
                  height: "18vh",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                }}
              >
                <CardContent>
                  <Typography>Date: {new Date(item.dt * 1000).toLocaleDateString()}</Typography>
                  <Typography>Time: {new Date(item.dt * 1000).toLocaleTimeString()}</Typography>
                  <Typography>Temperature: {item.main.temp}°C</Typography>
                  <Typography>Description: {item.weather[0].description}</Typography>
                  {item.weather[0].icon === "01d" && <TiWeatherSunny />}
                  {item.weather[0].icon === "01n" && <TiWeatherNight />}
                  {item.weather[0].icon === "02d" && <TiWeatherPartlySunny />}
                  {item.weather[0].icon === "02n" && <TiWeatherPartlySunny />}
                  {item.weather[0].icon === "03d" && <TiWeatherCloudy />}
                  {item.weather[0].icon === "03n" && <TiWeatherCloudy />}
                  {item.weather[0].icon === "04d" && <TiWeatherCloudy />}
                  {item.weather[0].icon === "04n" && <TiWeatherCloudy />}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default Weather;
