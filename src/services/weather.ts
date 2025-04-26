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
   * The date for which the forecast is provided.
   */
  date: string;
  /**
   * The temperature in Fahrenheit.
   */
  temperatureFahrenheit: number;
  /**
   * The humidity percentage.
   */
  humidity: number;
  /**
   * The wind speed in miles per hour.
   */
  windSpeed: number;
  /**
   * The precipitation in inches.
   */
  precipitation: number;
  /**
   * The weather conditions (e.g., Sunny, Cloudy, Rainy).
   */
  conditions: string;
}

/**
 * Asynchronously retrieves weather forecast data for a given location.
 *
 * @param location The location for which to retrieve weather data.
 * @param days The number of days for which to retrieve the forecast (up to 15).
 * @returns A promise that resolves to an array of DailyForecast objects.
 */
export async function getForecast(
  location: Location,
  days: number
): Promise<DailyForecast[]> {
  // TODO: Implement this by calling an external weather API.

  const dummyData: DailyForecast[] = [];
  for (let i = 0; i < days; i++) {
    dummyData.push({
      date: `2024-08-${10 + i}`,
      temperatureFahrenheit: 75 + i,
      humidity: 60 + i,
      windSpeed: 5 + i,
      precipitation: 0.1 * i,
      conditions: i % 2 === 0 ? 'Sunny' : 'Cloudy',
    });
  }
  return dummyData;
}

/**
 * Represents weather information, including temperature and conditions.
 */
export interface Weather {
  /**
   * The temperature in Fahrenheit. ex: 73
   */
  temperatureFarenheit: number;
  /**
   * The weather conditions (e.g., Sunny, Cloudy, Rainy).
   */
  conditions: string;
}

/**
 * Asynchronously retrieves weather information for a given location.
 *
 * @param location The location for which to retrieve weather data.
 * @returns A promise that resolves to a Weather object containing temperature and conditions.
 */
export async function getWeather(location: Location): Promise<Weather> {
  // TODO: Implement this by calling an API.

  return {
    temperatureFarenheit: 73,
    conditions: 'Sunny',
  };
}
