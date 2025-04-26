import type { Weather } from '@/services/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { Droplet, Wind, Loader2 } from 'lucide-react'; // Added Loader2 for spinning icon
import { MapPin } from 'lucide-react'; // Added MapPin for the placeholder state
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

type CurrentWeatherCardProps = {
  weather: Weather | null;
  city?: string;
  isLoading: boolean;
};

export function CurrentWeatherCard({ weather, city, isLoading }: CurrentWeatherCardProps) {
  const hasData = !!weather;

  const formatValue = (value: number | undefined | null, fractionDigits = 0) => {
    if (typeof value !== 'number') return '--'; // Return placeholder if value is not a number
    // Use toLocaleString for better number formatting
    return value.toLocaleString('en-US', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    });
  };


  return (
    <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
       <CardHeader className="pb-2 bg-card/50 border-b">
         <CardTitle className="text-xl font-semibold text-center sm:text-left">
           {isLoading && !hasData ? (
              <span className="flex items-center justify-center sm:justify-start gap-2">
                 <Loader2 className="h-5 w-5 animate-spin mr-1" /> Loading Weather...
              </span>
            ) : city ? `Current Weather in ${city}` : 'Current Weather'}
         </CardTitle>
       </CardHeader>
       <CardContent className="flex flex-col items-center p-6 min-h-[200px] justify-center">
         {isLoading && !hasData ? (
          // More prominent loading state centered
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="animate-pulse">Fetching weather data...</p>
          </div>
        ) : hasData ? (
          // Animate content in when loaded
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500 w-full">
             {/* Pass iconCode and condition */}
            <WeatherIcon
                condition={weather.conditions}
                iconCode={weather.iconCode}
                className="w-20 h-20 text-accent drop-shadow-lg"
                size={80} // Explicit size prop for Lucide
            />
            <div className="text-center">
              <p className="text-5xl font-bold text-primary drop-shadow-sm">
                {formatValue(weather.temperatureFarenheit, 0)}°F
              </p>
              <p className="text-lg text-secondary-foreground capitalize">{weather.conditions}</p>
            </div>

            {/* Display Humidity and Wind Speed if available */}
            {(weather.humidity !== undefined || weather.windSpeed !== undefined) && (
                <div className="flex justify-around w-full max-w-[200px] mt-4 text-sm text-muted-foreground">
                  {weather.humidity !== undefined && (
                      <div className="flex items-center gap-1" title="Humidity">
                        <Droplet className="w-4 h-4" />
                        <span>{formatValue(weather.humidity, 0)}%</span>
                      </div>
                  )}
                  {weather.windSpeed !== undefined && (
                       <div className="flex items-center gap-1" title="Wind Speed">
                        <Wind className="w-4 h-4" />
                        <span>{formatValue(weather.windSpeed, 0)} mph</span>
                      </div>
                  )}
                </div>
            )}
          </div>
        ) : (
           // Improved placeholder state when not loading and no data
           <div className="text-center text-muted-foreground">
             <MapPin className="h-12 w-12 mx-auto mb-2 text-primary/50" />
             <p>Enter a city or use location detection</p>
             <p className="text-xs">to see the current weather.</p>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
