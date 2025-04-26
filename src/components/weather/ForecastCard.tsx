import type { DailyForecast } from '@/services/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './WeatherIcon';
import { Droplet, Wind, Umbrella } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type ForecastCardProps = {
  forecast: DailyForecast;
  isUsingApiKey: boolean; // Pass this down
  className?: string; // Allow passing additional classes
};

export function ForecastCard({ forecast, isUsingApiKey, className }: ForecastCardProps) {
  // Ensure date is treated as local time, not UTC, to avoid day shifts
  // Handle potential invalid date string gracefully
  let formattedDate = 'Invalid Date';
  try {
      // Date is already YYYY-MM-DD string, safe to parse directly if valid
      if (forecast.date && forecast.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const dateParts = forecast.date.split('-').map(Number);
          // Create date ensuring it uses local timezone interpretation
          const localDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
          if (!isNaN(localDate.getTime())) {
            formattedDate = format(localDate, 'EEE, MMM d');
          }
      }
  } catch (e) {
      console.error("Error parsing forecast date:", forecast.date, e);
  }

  const formatValue = (value: number | undefined | null, fractionDigits = 0) => {
    if (typeof value !== 'number') return '--';
    return value.toLocaleString('en-US', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
     });
  };

   // Units are now consistent based on API (m/s, mm) or simulation (m/s, mm)
   const windSpeedUnit = 'm/s';
   const precipitationUnit = 'mm';

  return (
    <Card className={cn(
        "w-[120px] flex flex-col items-center text-center shadow-md rounded-lg transition-all duration-200 ease-in-out hover:shadow-xl hover:-translate-y-1 border overflow-hidden flex-shrink-0",
        className
        )}>
      <CardHeader className="p-2 w-full bg-card/50 border-b">
        <CardTitle className="text-xs font-medium text-muted-foreground whitespace-nowrap">{formattedDate}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 flex flex-col items-center gap-1 flex-grow justify-between w-full">
        {/* Pass iconCode, condition, and isUsingApiKey */}
        <WeatherIcon
            condition={forecast.conditions}
            iconCode={forecast.iconCode}
            isUsingApiKey={isUsingApiKey} // Pass API key status
            className="w-10 h-10 text-primary mb-1 drop-shadow-sm"
            size={40} // Explicit size prop
        />
        {/* Display Celsius temperature */}
        <p className="text-lg font-semibold text-accent">{formatValue(forecast.temperatureCelsius, 0)}°C</p>
        <p className="text-xs text-secondary-foreground capitalize mb-2 truncate w-full" title={forecast.conditions}>{forecast.conditions}</p>
        <div className="space-y-1 text-xs text-muted-foreground w-full">
          <div className="flex items-center gap-1 justify-center" title="Humidity">
            <Droplet className="w-3 h-3 flex-shrink-0" />
            <span>{formatValue(forecast.humidity, 0)}%</span>
          </div>
          <div className="flex items-center gap-1 justify-center" title={`Wind Speed (${windSpeedUnit})`}>
            <Wind className="w-3 h-3 flex-shrink-0" />
            {/* Display wind speed with unit */}
            <span>{formatValue(forecast.windSpeed, 1)} {windSpeedUnit}</span>
          </div>
           <div className="flex items-center gap-1 justify-center" title={`Precipitation (${precipitationUnit})`}>
            <Umbrella className="w-3 h-3 flex-shrink-0" />
            {/* Show precipitation with 1 decimal place */}
            {/* Display precipitation with unit */}
            <span>{formatValue(forecast.precipitation, 1)}{precipitationUnit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
