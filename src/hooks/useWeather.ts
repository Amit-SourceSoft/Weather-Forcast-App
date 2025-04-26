import { useState, useCallback } from 'react';
import type { Location, Weather, DailyForecast } from '@/services/weather';
import { getWeather, getForecast } from '@/services/weather';
import { getCoordinatesByCity, getCurrentLocationCoordinates } from '@/services/geolocation'; // Assuming these exist

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
      const location = await getCoordinatesByCity(city);
      if (location) {
        await fetchWeatherData(location, city);
      } else {
        setError(`Could not find coordinates for ${city}.`);
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined);
        setIsLoading(false);
      }
    } catch (err) {
        console.error("Error searching by city:", err);
        setError('Failed to search for city. Please check the name and try again.');
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined);
        setIsLoading(false);
    }
  }, [fetchWeatherData]);

  const detectLocationAndFetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const location = await getCurrentLocationCoordinates();
      if (location) {
        // We don't get the city name from getCurrentLocationCoordinates, so pass undefined
        await fetchWeatherData(location, undefined);
        // Potentially add reverse geocoding here if city name is desired
      } else {
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
        setIsLoading(false);
    }
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
