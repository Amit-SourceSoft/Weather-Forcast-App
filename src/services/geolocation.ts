import type { Location } from './weather';

/**
 * Retrieves the geographical coordinates for a given city name.
 * This is a placeholder and simulates a successful call to a Geocoding API for any city.
 *
 * @param city The name of the city.
 * @returns A promise that resolves to a Location object (dummy coordinates).
 */
export async function getCoordinatesByCity(city: string): Promise<Location | null> {
  console.log(`Simulating coordinate fetch for city: ${city}`);
  // Placeholder: In a real app, call a Geocoding API.
  // Here, we simulate success by returning consistent dummy coordinates for any city.
  // This allows the weather fetching logic to proceed.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  // Return consistent dummy coordinates (e.g., New York) to allow the app flow to continue
  // The simulated weather service will return dummy data regardless of these coordinates.
  const dummyLocation: Location = { lat: 40.7128, lng: -74.0060 };
  console.log(`Simulated coordinates for ${city}:`, dummyLocation);
  return dummyLocation;
}

/**
 * Retrieves the user's current geographical coordinates using the browser's Geolocation API.
 *
 * @returns A promise that resolves to a Location object or null if geolocation fails or is denied.
 */
export function getCurrentLocationCoordinates(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Current location detected:", location);
        resolve(location);
      },
      (error) => {
        console.error("Error getting current location:", error.message);
        // Provide a more specific error message based on the error code
        let errorMessage = 'Failed to get location.';
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = "Location permission denied. Please enable location services in your browser/OS settings.";
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                errorMessage = "The request to get user location timed out.";
                break;
            default:
                 errorMessage = "An unknown error occurred while trying to get location.";
                 break;
        }
         console.error("Geolocation error details:", errorMessage);
        resolve(null); // Resolve with null on error
      },
      {
        enableHighAccuracy: false, // Lower accuracy is often faster and sufficient
        timeout: 10000,          // 10 seconds timeout
        maximumAge: 600000       // Use cached position if available and less than 10 minutes old
      }
    );
  });
}
