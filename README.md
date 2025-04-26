# Weather App

This is a Next.js weather forecast application built in Firebase Studio.

## Features

- Displays current weather and a 15-day forecast.
- Allows searching for weather by city name.
- Can detect the user's current location to show local weather.
- Uses ShadCN UI components and Tailwind CSS for styling.
- Includes basic loading states and error handling.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Set up Environment Variables:**
    - Create a `.env` file in the root of the project (or rename `.env.example` if provided).
    - **Weather API Key (Optional but Recommended):** For real-time weather data, you need an API key from a weather service provider.
        - Sign up for a free key at [OpenWeatherMap](https://openweathermap.org/appid) or [WeatherAPI.com](https://www.weatherapi.com/).
        - Add the key to your `.env` file:
          ```env
          WEATHER_API_KEY=your_actual_api_key_here
          ```
        - *If you don't provide an API key, the application will use simulated weather data.*
    - **Google Generative AI API Key (Optional):** If using Genkit features (not currently implemented in the base weather app), you'll need a Google AI key.
        - Obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
        - Add it to your `.env` file:
          ```env
          GOOGLE_GENAI_API_KEY=your_google_ai_key_here
          ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at [http://localhost:9002](http://localhost:9002).

4.  **Build for production:**
    ```bash
    npm run build
    ```

5.  **Start the production server:**
    ```bash
    npm run start
    ```

## Project Structure

- `src/app/`: Contains the main application pages and layout (using Next.js App Router).
- `src/components/`: Reusable UI components.
    - `src/components/ui/`: Components from ShadCN UI library.
    - `src/components/weather/`: Weather-specific components.
- `src/hooks/`: Custom React hooks (e.g., `useWeather`, `useToast`).
- `src/lib/`: Utility functions.
- `src/services/`: Modules for interacting with external services (geolocation, weather API).
- `src/ai/`: (If using Genkit) Contains AI-related flows and configurations.
- `public/`: Static assets.
- `styles/`: Global styles and Tailwind CSS configuration.

## Key Technologies

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Lucide React Icons
- Genkit (Optional, for AI features)

## Notes

- The application uses simulated data for weather if no `WEATHER_API_KEY` is provided in the `.env` file.
- Complex weather animations (rain, snow) are mentioned but not implemented in the base version.
