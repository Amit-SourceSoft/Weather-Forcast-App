import type { Weather } from '@/services/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { Thermometer, Droplet, Wind } from 'lucide-react'; // Import necessary icons

type CurrentWeatherCardProps = {
  weather: Weather | null;
  city?: string;
  isLoading: boolean;
  error?: string | null;
};

export function CurrentWeatherCard({ weather, city, isLoading, error }: CurrentWeatherCardProps) {
  return (
    <Card className="w-full max-w-md shadow-lg rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">
          {isLoading ? 'Loading...' : city ? `Current Weather in ${city}` : 'Current Weather'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-4">
        {isLoading && <p>Fetching weather data...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {weather && !isLoading && !error && (
          <div className="flex flex-col items-center gap-4">
            <WeatherIcon condition={weather.conditions} className="w-20 h-20 text-accent" />
            <div className="text-center">
              <p className="text-5xl font-bold text-primary">{weather.temperatureFarenheit}°F</p>
              <p className="text-lg text-secondary-foreground">{weather.conditions}</p>
            </div>
            {/* Example of adding humidity and wind speed if available in Weather type */}
            {/* <div className="flex justify-around w-full mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Droplet className="w-4 h-4" />
                <span>{weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4" />
                <span>{weather.windSpeed} mph</span>
              </div>
            </div> */}
          </div>
        )}
        {!weather && !isLoading && !error && (
          <p className="text-muted-foreground">Enter a city or use location detection.</p>
        )}
      </CardContent>
    </Card>
  );
}
