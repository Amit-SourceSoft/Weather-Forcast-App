import type { DailyForecast } from '@/services/weather';
import { ForecastCard } from './ForecastCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type ForecastDisplayProps = {
  forecasts: DailyForecast[];
  isLoading: boolean;
  error?: string | null;
};

export function ForecastDisplay({ forecasts, isLoading, error }: ForecastDisplayProps) {
  return (
    <div className="w-full mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">15-Day Forecast</h2>
      {isLoading && <p className="text-center">Loading forecast...</p>}
      {error && <p className="text-destructive text-center">{error}</p>}
      {!isLoading && !error && forecasts.length > 0 && (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
                {forecasts.map((forecast, index) => (
                <ForecastCard key={index} forecast={forecast} />
                ))}
            </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
       {!isLoading && !error && forecasts.length === 0 && (
          <p className="text-muted-foreground text-center">No forecast data available. Try searching for a city.</p>
       )}
    </div>
  );
}
