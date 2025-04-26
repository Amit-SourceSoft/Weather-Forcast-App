import type { DailyForecast } from '@/services/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { Thermometer, Droplet, Wind, Umbrella } from 'lucide-react';
import { format } from 'date-fns';

type ForecastCardProps = {
  forecast: DailyForecast;
};

export function ForecastCard({ forecast }: ForecastCardProps) {
  const formattedDate = format(new Date(forecast.date + 'T00:00:00'), 'EEE, MMM d'); // Ensure date is parsed correctly

  return (
    <Card className="w-full flex flex-col items-center text-center shadow-md rounded-lg transition-transform hover:scale-105">
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-medium">{formattedDate}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col items-center gap-2">
        <WeatherIcon condition={forecast.conditions} className="w-10 h-10 text-primary mb-1" />
        <p className="text-lg font-semibold text-accent">{forecast.temperatureFahrenheit}°F</p>
        <p className="text-xs text-muted-foreground capitalize">{forecast.conditions}</p>
        <div className="mt-2 space-y-1 text-xs text-secondary-foreground">
          <div className="flex items-center gap-1 justify-center">
            <Droplet className="w-3 h-3" />
            <span>{forecast.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <Wind className="w-3 h-3" />
            <span>{forecast.windSpeed} mph</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <Umbrella className="w-3 h-3" />
            <span>{forecast.precipitation}"</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
