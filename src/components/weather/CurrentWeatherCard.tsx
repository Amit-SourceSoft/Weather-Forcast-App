import type { Weather } from '@/services/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { Thermometer, Droplet, Wind, Loader2 } from 'lucide-react'; // Added Loader2 for spinning icon
import { MapPin } from 'lucide-react'; // Added MapPin for the placeholder state

type CurrentWeatherCardProps = {
  weather: Weather | null;
  city?: string;
  isLoading: boolean;
  // Error handled by toast, removed prop
};

export function CurrentWeatherCard({ weather, city, isLoading }: CurrentWeatherCardProps) {
  const hasData = !!weather;

  const formatValue = (value: number | undefined) => {
    if (typeof value !== 'number') return '';
    // Use toLocaleString for better number formatting, limiting to 2 decimal places
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };


  return (
    <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
       <CardHeader className="pb-2 bg-card/50 border-b">
         <CardTitle className="text-xl font-semibold text-center sm:text-left">
           {isLoading && !hasData ? (
              <span className="flex items-center justify-center sm:justify-start gap-2 animate-pulse">
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
          <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
            <WeatherIcon condition={weather.conditions} className="w-20 h-20 text-accent drop-shadow-lg" />
            <div className="text-center">
              <p className="text-5xl font-bold text-primary drop-shadow-sm">
                {formatValue(weather.temperatureFarenheit)}°F
              </p>
              <p className="text-lg text-secondary-foreground capitalize">{weather.conditions}</p>
            </div>
            {/* Removed example details as they are not part of the base Weather type */}
            {/* <div className="flex justify-around w-full mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Droplet className="w-4 h-4" />
                <span>{formatValue(weather.humidity)}%</span> {}
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4" />
                <span>{formatValue(weather.windSpeed)} mph</span> {}
              </div>
            </div> */}
          </div>
        ) : (
           // Improved placeholder state
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
