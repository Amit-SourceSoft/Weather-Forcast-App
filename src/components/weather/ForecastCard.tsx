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

  const formatValue = (value: number | undefined) => {
    if (typeof value !== 'number') return '';
    // Use toLocaleString for better number formatting, limiting to 2 decimal places
    return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };


  return (
    <Card className={cn(
        "w-[120px] flex flex-col items-center text-center shadow-md rounded-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 border overflow-hidden flex-shrink-0", // Added overflow-hidden and flex-shrink-0
        className // Merge additional classes
        )}>
      <CardHeader className="p-2 w-full">
        <CardTitle className="text-xs font-medium text-muted-foreground whitespace-nowrap">{formattedDate}</CardTitle> {/* Added whitespace-nowrap */}
      </CardHeader>
      <CardContent className="p-3 flex flex-col items-center gap-1 flex-grow justify-between w-full"> {/* Ensured w-full */}
        <WeatherIcon condition={forecast.conditions} className="w-10 h-10 text-primary mb-1 drop-shadow-sm" />
        <p className="text-lg font-semibold text-accent">{formatValue(forecast.temperatureFahrenheit)}°F</p>
        <p className="text-xs text-secondary-foreground capitalize mb-2 truncate w-full">{forecast.conditions}</p> {/* Added truncate */}
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 justify-center">
            <Droplet className="w-3 h-3 flex-shrink-0" /> {/* Added flex-shrink-0 */}
            <span>{formatValue(forecast.humidity)}%</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <Wind className="w-3 h-3 flex-shrink-0" /> {/* Added flex-shrink-0 */}
            <span>{formatValue(forecast.windSpeed)} mph</span>
          </div>
          <div className="flex items-center gap-1 justify-center">
            <Umbrella className="w-3 h-3 flex-shrink-0" /> {/* Added flex-shrink-0 */}
            <span>{formatValue(forecast.precipitation)}"</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
