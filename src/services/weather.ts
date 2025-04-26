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
   * The average temperature in Fahrenheit.
   */
  temperatureFahrenheit: number;
  /**
   * The average humidity percentage.
   */
  humidity: number;
  /**
   * The average wind speed in miles per hour.
   */
  windSpeed: number;
  /**
   * The total precipitation in inches.
   */
  precipitation: number;
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
   * The current temperature in Fahrenheit. ex: 73
   */
  temperatureFarenheit: number;
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
const API_KEY = process.env.WEATHER_API_KEY;
const USE_SIMULATION = !API_KEY; // Use simulation if no API key is provided

// --- Helper Functions (Simulated Data) ---

function simulateCurrentWeather(location: Location): Weather {
  console.warn(`SIMULATION: Generating dummy current weather for ${location.lat}, ${location.lng}. Add WEATHER_API_KEY to .env for real data.`);
  // Simple simulation based on latitude (e.g., warmer towards equator)
  const baseTemp = 60 + (40 - Math.abs(location.lat)) * 0.5;
  const conditions = ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Showers', 'Thunderstorm', 'Snow'];
  // Make condition slightly dependent on location for variety
  const conditionIndex = Math.floor(Math.abs(location.lat + location.lng)) % conditions.length;

  return {
    temperatureFarenheit: baseTemp + Math.random() * 10 - 5, // Add some randomness
    conditions: conditions[conditionIndex],
    humidity: 40 + Math.random() * 40,
    windSpeed: 5 + Math.random() * 15,
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
        const baseTemp = 60 + (40 - Math.abs(location.lat)) * 0.5 + Math.sin(i * Math.PI / 7) * 5; // Weekly temp wave
        const conditionIndex = Math.floor(Math.abs(location.lat + location.lng + i)) % conditions.length;

        forecast.push({
            date: dateString,
            temperatureFahrenheit: baseTemp + Math.random() * 8 - 4,
            humidity: 50 + Math.random() * 30,
            windSpeed: 3 + Math.random() * 12,
            precipitation: Math.random() < 0.2 ? Math.random() * 0.5 : 0, // Chance of precipitation
            conditions: conditions[conditionIndex],
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
  // Replace with your chosen API endpoint and data mapping
  // Example using OpenWeatherMap (adjust URL and params as needed):
  // const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${API_KEY}&units=imperial`;
  // try {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  //   }
  //   const data = await response.json();

  //   // Map API response to Weather interface
  //   const weather: Weather = {
  //     temperatureFarenheit: data.main.temp,
  //     conditions: data.weather[0]?.main || 'Unknown', // Example mapping
  //     humidity: data.main.humidity,
  //     windSpeed: data.wind.speed,
  //     iconCode: data.weather[0]?.icon,
  //   };
  //   return weather;
  // } catch (error) {
  //   console.error("Error fetching real current weather:", error);
  //   throw error; // Re-throw the error to be handled by the caller
  // }
  // --- End Real API Example ---

  // If API_KEY is set but the code above is commented out, fall back to simulation with a warning.
  console.warn("WEATHER_API_KEY is set, but real API fetch logic is commented out. Using simulation.");
  await new Promise(resolve => setTimeout(resolve, 300));
  return simulateCurrentWeather(location);
}


/**
 * Asynchronously retrieves the weather forecast for a given location.
 * Uses a real API if WEATHER_API_KEY is set, otherwise returns simulated data.
 *
 * @param location The location for which to retrieve weather data.
 * @param days The number of days for the forecast (max depends on API, often 7-16).
 * @returns A promise that resolves to an array of DailyForecast objects.
 * @throws Throws an error if the API call fails (and not using simulation).
 */
export async function getForecast(location: Location, days: number): Promise<DailyForecast[]> {
  if (USE_SIMULATION) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return simulateForecast(location, days);
  }

  // --- Real API Implementation Example (requires an API key) ---
  // Replace with your chosen API endpoint and data mapping
  // Example using OpenWeatherMap 16-day forecast (paid or limited free tier) or a 7-day API:
  // Note: OpenWeatherMap free tier might only offer 5-day/3-hour forecast easily.
  // A common approach is the One Call API (requires subscription for >7 days usually)
  // const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${location.lat}&lon=${location.lng}&cnt=${days}&appid=${API_KEY}&units=imperial`; // Example daily forecast URL
  // Or for One Call API (adjust version and params):
  // const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lng}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=imperial`;

  // try {
  //   const response = await fetch(url);
  //   if (!response.ok) {
  //     throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  //   }
  //   const data = await response.json();

  //   // Map API response to DailyForecast interface (adjust based on API structure)
  //   const forecast: DailyForecast[] = data.daily.slice(0, days).map((dayData: any) => ({ // Example mapping for One Call API
  //     date: new Date(dayData.dt * 1000).toISOString().split('T')[0],
  //     temperatureFahrenheit: dayData.temp.day, // Average day temp
  //     humidity: dayData.humidity,
  //     windSpeed: dayData.wind_speed,
  //     precipitation: dayData.rain || 0, // Precipitation volume in mm, convert if needed
  //     conditions: dayData.weather[0]?.main || 'Unknown',
  //     iconCode: dayData.weather[0]?.icon,
  //   }));
  //   return forecast;

  // } catch (error) {
  //   console.error("Error fetching real forecast:", error);
  //   throw error; // Re-throw the error
  // }
  // --- End Real API Example ---

  // If API_KEY is set but the code above is commented out, fall back to simulation with a warning.
  console.warn("WEATHER_API_KEY is set, but real API fetch logic is commented out. Using simulation.");
  await new Promise(resolve => setTimeout(resolve, 500));
  return simulateForecast(location, days);
}
