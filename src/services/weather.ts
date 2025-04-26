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
   * The average wind speed in meters per second (m/s).
   */
  windSpeed: number; // API provides m/s
  /**
   * The total precipitation in millimeters (mm).
   */
  precipitation: number; // API provides mm
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
   * Optional: Current wind speed in meters per second (m/s).
   */
  windSpeed?: number; // API provides m/s
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
  console.warn(`SIMULATION: Generating dummy current weather for ${location.lat}, ${location.lng}. Add NEXT_PUBLIC_WEATHER_API_KEY to .env for real data.`);
  // Simple simulation based on latitude (e.g., warmer towards equator)
  const baseTempCelsius = 15 + (20 - Math.abs(location.lat)) * 0.4; // Adjusted base for Celsius
  const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Showers', 'Thunderstorm', 'Snow', 'Fog', 'Haze'];
  // Make condition slightly dependent on location for variety
  const conditionIndex = Math.floor(Math.abs(location.lat + location.lng)) % conditions.length;

  return {
    temperatureCelsius: parseFloat((baseTempCelsius + Math.random() * 5 - 2.5).toFixed(1)), // Add some randomness, ensure float
    conditions: conditions[conditionIndex],
    humidity: Math.round(40 + Math.random() * 40), // Whole number for humidity %
    windSpeed: parseFloat((2 + Math.random() * 8).toFixed(1)), // Simulate m/s wind speed
    // No iconCode for simulation, rely on condition mapping in WeatherIcon component
    // iconCode: `sim_${conditionIndex}${Math.random() > 0.5 ? 'd' : 'n'}`, // Remove simulated icon code
  };
}

function simulateForecast(location: Location, days: number): DailyForecast[] {
    console.warn(`SIMULATION: Generating dummy ${days}-day forecast for ${location.lat}, ${location.lng}. Add NEXT_PUBLIC_WEATHER_API_KEY to .env for real data.`);
    const forecast: DailyForecast[] = [];
    const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Showers', 'Thunderstorm', 'Snow', 'Fog', 'Haze'];
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
            temperatureCelsius: parseFloat((baseTempCelsius + Math.random() * 4 - 2).toFixed(1)),
            humidity: Math.round(50 + Math.random() * 30),
            windSpeed: parseFloat((1 + Math.random() * 6).toFixed(1)), // Simulate m/s wind speed
            precipitation: parseFloat(Math.random() < 0.2 ? (Math.random() * 10).toFixed(1) : '0.0'), // Simulate mm precipitation
            conditions: conditions[conditionIndex],
            // No iconCode for simulation
            // iconCode: `sim_${conditionIndex}${Math.random() > 0.5 ? 'd' : 'n'}`, // Remove simulated icon code
        });
    }
    return forecast;
}

// --- API Interaction Functions ---

/**
 * Asynchronously retrieves the current weather for a given location.
 * Uses a real API if NEXT_PUBLIC_WEATHER_API_KEY is set, otherwise returns simulated data.
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

  // --- Real API Implementation Example (OpenWeatherMap Current Weather API) ---
  // Use 'metric' for Celsius, m/s wind, etc.
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=metric`;
  console.log("Fetching real current weather from:", url); // Log URL for debugging (remove API key in production logs)
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
      console.error("API Error Data:", data); // Log the error data
      throw new Error(errorMessage);
    }


    // Map API response to Weather interface
    const weather: Weather = {
      temperatureCelsius: data.main?.temp,
      conditions: data.weather?.[0]?.description ?? data.weather?.[0]?.main ?? 'Unknown', // Use description if available
      humidity: data.main?.humidity,
      windSpeed: data.wind?.speed, // API provides m/s with units=metric
      iconCode: data.weather?.[0]?.icon, // Get the icon code
    };
    console.log("Parsed Real Current Weather:", weather);
    return weather;
  } catch (error) {
    console.error("Error fetching real current weather:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
  // --- End Real API Example ---
}


/**
 * Asynchronously retrieves the weather forecast for a given location.
 * Uses a real API if NEXT_PUBLIC_WEATHER_API_KEY is set, otherwise returns simulated data.
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

  // --- Real API Implementation Example (OpenWeatherMap One Call API 3.0) ---
  // Use 'metric' for Celsius, m/s wind, mm rain. 'exclude' optimizes the call.
  const exclude = 'current,minutely,hourly,alerts'; // Exclude parts not needed for daily forecast
  // Limit requested days if API has limitations (OneCall free tier usually gives 7-8 days)
  const requestedDays = Math.min(days, 8); // Adjust based on your API plan if needed
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&exclude=${exclude}&appid=${API_KEY}&units=metric`;
  console.log("Fetching real forecast from:", url); // Log URL for debugging (remove API key in production logs)

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
        console.error("API Error Data:", data); // Log the error data
      throw new Error(errorMessage);
    }

    if (!data.daily) {
        console.warn("API response did not contain 'daily' forecast data. Check API plan or response structure.");
        return []; // Return empty array or throw a more specific error
    }

    // Map API response to DailyForecast interface
    // Slice to the originally requested number of days, even if API returns more/less
    const forecast: DailyForecast[] = data.daily.slice(0, days).map((dayData: any): DailyForecast => ({
      date: new Date(dayData.dt * 1000).toISOString().split('T')[0], // Convert timestamp to YYYY-MM-DD
      temperatureCelsius: dayData.temp?.day, // Average day temp in Celsius
      humidity: dayData.humidity,
      windSpeed: dayData.wind_speed, // API provides m/s with units=metric
      precipitation: dayData.rain ?? 0, // API provides rain in mm (use 0 if undefined)
      conditions: dayData.weather?.[0]?.description ?? dayData.weather?.[0]?.main ?? 'Unknown', // Use description
      iconCode: dayData.weather?.[0]?.icon, // Get the icon code
    }));

    console.log(`Parsed Real ${forecast.length}-Day Forecast:`, forecast);
    return forecast;

  } catch (error) {
    console.error("Error fetching real forecast:", error);
    throw error; // Re-throw the error
  }
  // --- End Real API Example ---
}
