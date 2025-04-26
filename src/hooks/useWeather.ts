import { useState, useCallback, useEffect } from 'react';
import type { Location, Weather, DailyForecast } from '@/services/weather';
import { getWeather, getForecast } from '@/services/weather';
import { getCoordinatesByCity, getCurrentLocationCoordinates } from '@/services/geolocation';

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string | undefined>(undefined);
  const [isUsingApiKey, setIsUsingApiKey] = useState(false);

  // Check for API key availability on mount (client-side only)
   useEffect(() => {
    // Access the env var correctly on the client
    if (typeof window !== 'undefined') {
      setIsUsingApiKey(!!process.env.NEXT_PUBLIC_WEATHER_API_KEY);
    }
  }, []);


  const fetchWeatherData = useCallback(async (location: Location, city?: string) => {
    setIsLoading(true);
    setError(null);
    // Update city optimistically, might be overwritten by reverse geocoding later if needed
    setCurrentCity(city || (location ? 'Detected Location' : undefined));

    console.log(`Fetching weather for: ${city || `Lat: ${location?.lat}, Lng: ${location?.lng}`}`);
    console.log(`Using ${isUsingApiKey ? 'real API data' : 'simulated data'}.`);

    try {
      // Fetch both current weather and forecast concurrently
      const [weatherData, forecastData] = await Promise.all([
        getWeather(location),
        getForecast(location, 15) // Fetch 15 days forecast
      ]);

      setCurrentWeather(weatherData);
      setForecast(forecastData);

       // If city name wasn't provided (e.g., from location detection),
       // you might want to add reverse geocoding here to get the city name
       // const actualCityName = await getCityFromCoords(location);
       // setCurrentCity(actualCityName || 'Unknown Location');

    } catch (err: any) {
      console.error("Failed to fetch weather data:", err);
      const errorMessage = err.message || 'Failed to fetch weather data. Please try again.';
       // Check if the error message indicates an invalid API key (common issue)
      if (errorMessage.toLowerCase().includes('invalid api key') || errorMessage.includes('401')) {
          setError('Invalid or missing API key. Please check your .env configuration.');
      } else {
          setError(errorMessage);
      }
      setCurrentWeather(null);
      setForecast([]);
      setCurrentCity(city); // Keep the searched city name even on error if it was a search
    } finally {
      setIsLoading(false);
    }
  }, [isUsingApiKey]); // Add isUsingApiKey dependency

  const searchByCity = useCallback(async (city: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentCity(city); // Set city name immediately for user feedback
    try {
      // Get coordinates for the city. This might still be a simulation
      // if the geolocation service only simulates, but it's necessary for the weather service.
      const location = await getCoordinatesByCity(city);
      if (location) {
        // Fetch weather using the potentially simulated coordinates but display the searched city name
        await fetchWeatherData(location, city);
      } else {
        setError(`Could not find location data for ${city}.`);
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined); // Reset city if location fails
        setIsLoading(false); // Ensure loading stops
      }
    } catch (err: any) {
        console.error("Error searching by city:", err);
        setError(err.message || 'Failed to search for city weather. Please try again.');
        setCurrentWeather(null);
        setForecast([]);
        // Keep city name for context unless location lookup failed completely
        // setCurrentCity(undefined);
        setIsLoading(false); // Ensure loading state is reset on error
    }
  }, [fetchWeatherData]);

  const detectLocationAndFetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCurrentCity('Detecting Location...'); // Provide immediate feedback
    try {
      const location = await getCurrentLocationCoordinates();
      if (location) {
        // Fetch weather for the detected coordinates
        // City name will be updated by fetchWeatherData (or reverse geocoding if added)
        await fetchWeatherData(location, undefined);
      } else {
        // Error message comes from getCurrentLocationCoordinates failure handler
        setError('Could not detect your location. Please enable location services or enter a city manually.');
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined); // Reset city name on failure
        setIsLoading(false); // Ensure loading stops
      }
    } catch (err: any) {
        console.error("Error detecting location:", err);
        setError(err.message || 'Failed to detect location. Ensure permissions are granted.');
        setCurrentWeather(null);
        setForecast([]);
        setCurrentCity(undefined); // Reset city name on failure
        setIsLoading(false); // Ensure loading state is reset on error
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
    isUsingApiKey, // Expose this for potential UI indicators
  };
}
