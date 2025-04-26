import { useState, useCallback } from 'react';
import type { Location, Weather, DailyForecast } from '@/services/weather';
import { getWeather, getForecast } from '@/services/weather';
import { getCoordinatesByCity, getCurrentLocationCoordinates } from '@/services/geolocation';

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string | undefined>(undefined);

  const fetchWeatherData = useCallback(async (location: Location, city?: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentCity(city); // Set city name if provided

    try {
      // Fetch both current weather and forecast concurrently
      const [weatherData, forecastData] = await Promise.all([
        getWeather(location),
        getForecast(location, 15) // Fetch 15 days forecast
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setError('Failed to fetch weather data. Please try again.');
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchByCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate fetching coordinates - this will now always return dummy coordinates
      const location = await getCoordinatesByCity(city);
      if (location) {
        // Fetch weather using the dummy coordinates but display the searched city name
        await fetchWeatherData(location, city);
      } else {
        // This case should technically not happen with the simulation, but keep for robustness
        setError(`Could not process request for ${city}.`);
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined);
        setIsLoading(false);
      }
    } catch (err) {
        console.error("Error searching by city:", err);
        setError('Failed to search for city weather. Please try again.');
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined);
        setIsLoading(false); // Ensure loading state is reset on error
    }
    // No finally block needed here as fetchWeatherData handles its own loading state
  }, [fetchWeatherData]);

  const detectLocationAndFetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const location = await getCurrentLocationCoordinates();
      if (location) {
        // Fetch weather for the detected coordinates, city name will be undefined initially
        await fetchWeatherData(location, undefined);
        // TODO: Optionally implement reverse geocoding here to get city name from coordinates
        // const cityName = await getCityNameFromCoordinates(location);
        // setCurrentCity(cityName);
      } else {
        // Error message comes from getCurrentLocationCoordinates failure handler
        setError('Could not detect your location. Please enable location services or enter a city.');
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined);
        setIsLoading(false);
      }
    } catch (err) {
        console.error("Error detecting location:", err);
        setError('Failed to detect location. Please ensure location services are enabled and permissions granted.');
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined);
        setIsLoading(false); // Ensure loading state is reset on error
    }
    // No finally block needed here as fetchWeatherData handles its own loading state
  }, [fetchWeatherData]);


  return {
    currentWeather,
    forecast,
    isLoading,
    error,
    currentCity,
    searchByCity,
    detectLocationAndFetch,
  };
}
