import type { DailyForecast } from '@/services/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { Thermometer, Droplet, Wind, Umbrella } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ForecastCardProps = {
  forecast: DailyForecast;
  className?: string; // Allow passing additional classes
};

export function ForecastCard({ forecast, className }: ForecastCardProps) {
  // Ensure date is treated as local time, not UTC, to avoid day shifts
  const dateParts = forecast.date.split('-').map(Number);
  const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const formattedDate = format(localDate, 'EEE, MMM d');

  return (
    <Card className={cn(
        "w-[120px] flex flex-col items-center text-center shadow-md rounded-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 border", // Added border
        className // Merge additional classes
        )}>
      <CardHeader className="p-2 w-full">
        <CardTitle className="text-xs font-medium text-muted-foreground">{formattedDate}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col items-center gap-1 flex-grow justify-between">
        <WeatherIcon condition={forecast.conditions} className="w-10 h-10 text-primary mb-1 drop-shadow-sm" />
        <p className="text-lg font-semibold text-accent">{forecast.temperatureFahrenheit}°F</p>
        <p className="text-xs text-secondary-foreground capitalize mb-2">{forecast.conditions}</p>
        <div className="space-y-1 text-xs text-muted-foreground">
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
