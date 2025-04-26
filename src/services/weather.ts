/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents weather forecast data for a single day.
 */
export interface DailyForecast {
  /**
   * The date for which the forecast is provided (YYYY-MM-DD).
   */
  date: string;
  /**
   * The average temperature in Celsius.
   */
  temperatureCelsius: number;
  /**
   * The average humidity percentage.
   */
  humidity: number;
  /**
   * The average wind speed in miles per hour.
   */
  windSpeed: number; // Keep mph for now unless specified otherwise
  /**
   * The total precipitation in inches.
   */
  precipitation: number; // Keep inches for now unless specified otherwise
  /**
   * A general description of the weather conditions (e.g., Sunny, Partly cloudy, Light rain).
   */
  conditions: string;
  /**
   * Optional: Icon code from the API provider (e.g., '01d' for OpenWeatherMap).
   */
  iconCode?: string;
}

/**
 * Represents current weather information.
 */
export interface Weather {
  /**
   * The current temperature in Celsius. ex: 23
   */
  temperatureCelsius: number;
  /**
   * A description of the current weather conditions (e.g., Sunny, Cloudy, Rainy).
   */
  conditions: string;
  /**
   * Optional: Current humidity percentage.
   */
  humidity?: number;
   /**
   * Optional: Current wind speed in miles per hour.
   */
  windSpeed?: number;
  /**
   * Optional: Icon code from the API provider (e.g., '01d' for OpenWeatherMap).
   */
  iconCode?: string;
}


// --- Configuration ---
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; // Use NEXT_PUBLIC_ prefix for client-side access check
const USE_SIMULATION = !API_KEY; // Use simulation if no API key is provided

// --- Helper Functions (Simulated Data) ---

function simulateCurrentWeather(location: Location): Weather {
  console.warn(`SIMULATION: Generating dummy current weather for ${location.lat}, ${location.lng}. Add WEATHER_API_KEY to .env for real data.`);
  // Simple simulation based on latitude (e.g., warmer towards equator)
  const baseTempCelsius = 15 + (20 - Math.abs(location.lat)) * 0.4; // Adjusted base for Celsius
  const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Showers', 'Thunderstorm', 'Snow'];
  // Make condition slightly dependent on location for variety
  const conditionIndex = Math.floor(Math.abs(location.lat + location.lng)) % conditions.length;

  return {
    temperatureCelsius: baseTempCelsius + Math.random() * 5 - 2.5, // Add some randomness
    conditions: conditions[conditionIndex],
    humidity: 40 + Math.random() * 40,
    windSpeed: 5 + Math.random() * 15,
    iconCode: `sim_${conditionIndex}${Math.random() > 0.5 ? 'd' : 'n'}`, // Simulate icon code
  };
}

function simulateForecast(location: Location, days: number): DailyForecast[] {
    console.warn(`SIMULATION: Generating dummy ${days}-day forecast for ${location.lat}, ${location.lng}. Add WEATHER_API_KEY to .env for real data.`);
    const forecast: DailyForecast[] = [];
    const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Showers', 'Thunderstorm', 'Snow'];
    const today = new Date();

    for (let i = 0; i < Math.min(days, 15); i++) { // Limit simulation to 15 days max
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

        // Simulate daily variation
        const baseTempCelsius = 15 + (20 - Math.abs(location.lat)) * 0.4 + Math.sin(i * Math.PI / 7) * 3; // Weekly temp wave in Celsius
        const conditionIndex = Math.floor(Math.abs(location.lat + location.lng + i)) % conditions.length;

        forecast.push({
            date: dateString,
            temperatureCelsius: baseTempCelsius + Math.random() * 4 - 2,
            humidity: 50 + Math.random() * 30,
            windSpeed: 3 + Math.random() * 12,
            precipitation: Math.random() < 0.2 ? Math.random() * 0.5 : 0, // Chance of precipitation (keep inches for now)
            conditions: conditions[conditionIndex],
            iconCode: `sim_${conditionIndex}${Math.random() > 0.5 ? 'd' : 'n'}`, // Simulate icon code
        });
    }
    return forecast;
}

// --- API Interaction Functions ---

/**
 * Asynchronously retrieves the current weather for a given location.
 * Uses a real API if WEATHER_API_KEY is set, otherwise returns simulated data.
 *
 * @param location The location for which to retrieve weather data.
 * @returns A promise that resolves to a Weather object.
 * @throws Throws an error if the API call fails (and not using simulation).
 */
export async function getWeather(location: Location): Promise<Weather> {
  if (USE_SIMULATION) {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return simulateCurrentWeather(location);
  }

  // --- Real API Implementation Example (requires an API key) ---
  // Example using OpenWeatherMap: Use 'metric' for Celsius
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const data = await response.json(); // Read response body once

    if (!response.ok) {
        let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        if (data && data.message) {
            errorMessage += ` - ${data.message}`; // Append API-provided error message
        }
        // Specific check for common API key issues
        if (response.status === 401) {
             errorMessage = 'Invalid or unauthorized API key. Check your .env configuration and OpenWeatherMap subscription.';
        }
      throw new Error(errorMessage);
    }


    // Map API response to Weather interface
    const weather: Weather = {
      temperatureCelsius: data.main.temp,
      conditions: data.weather[0]?.description || data.weather[0]?.main || 'Unknown', // Use description if available
      humidity: data.main.humidity,
      // Convert wind speed from m/s (metric) to mph if desired, or keep m/s
      // windSpeed: data.wind.speed * 2.23694, // m/s to mph
      windSpeed: data.wind.speed, // Keeping m/s for now, will display as such
      iconCode: data.weather[0]?.icon,
    };
    return weather;
  } catch (error) {
    console.error("Error fetching real current weather:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
  // --- End Real API Example ---
}


/**
 * Asynchronously retrieves the weather forecast for a given location.
 * Uses a real API if WEATHER_API_KEY is set, otherwise returns simulated data.
 *
 * @param location The location for which to retrieve weather data.
 * @param days The number of days for the forecast (max depends on API, often 7-16). OpenWeatherMap free provides 5 days / 3 hours. OneCall API provides daily forecasts.
 * @returns A promise that resolves to an array of DailyForecast objects.
 * @throws Throws an error if the API call fails (and not using simulation).
 */
export async function getForecast(location: Location, days: number): Promise<DailyForecast[]> {
  if (USE_SIMULATION) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return simulateForecast(location, days);
  }

  // --- Real API Implementation Example (requires an API key) ---
  // Using OpenWeatherMap One Call API 3.0 (Recommended for daily forecasts)
  // Note: May require subscription for full access. Ensure your plan supports daily forecasts.
  // Use 'metric' for Celsius. 'exclude' can optimize the call.
  const exclude = 'current,minutely,hourly,alerts'; // Exclude parts you don't need
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&exclude=${exclude}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);
     const data = await response.json(); // Read response body once

    if (!response.ok) {
       let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        if (data && data.message) {
            errorMessage += ` - ${data.message}`; // Append API-provided error message
        }
         // Specific check for common API key issues
        if (response.status === 401) {
             errorMessage = 'Invalid or unauthorized API key. Check your .env configuration and OpenWeatherMap subscription for OneCall API access.';
        }
      throw new Error(errorMessage);
    }

    if (!data.daily) {
        console.warn("API response did not contain 'daily' forecast data. Check API plan or response structure.");
        return []; // Return empty array or throw a more specific error
    }

    // Map API response to DailyForecast interface (adjust based on API structure)
    const forecast: DailyForecast[] = data.daily.slice(0, days).map((dayData: any) => ({
      date: new Date(dayData.dt * 1000).toISOString().split('T')[0],
      temperatureCelsius: dayData.temp.day, // Average day temp in Celsius
      humidity: dayData.humidity,
       // Convert wind speed from m/s (metric) to mph if desired
      // windSpeed: dayData.wind_speed * 2.23694, // m/s to mph
      windSpeed: dayData.wind_speed, // Keeping m/s
      // Precipitation is in mm, convert to inches if needed
      // precipitation: (dayData.rain || 0) / 25.4, // mm to inches
      precipitation: (dayData.rain || 0), // Keeping mm
      conditions: dayData.weather[0]?.description || dayData.weather[0]?.main || 'Unknown', // Use description
      iconCode: dayData.weather[0]?.icon,
    }));
    return forecast;

  } catch (error) {
    console.error("Error fetching real forecast:", error);
    throw error; // Re-throw the error
  }
  // --- End Real API Example ---
}
