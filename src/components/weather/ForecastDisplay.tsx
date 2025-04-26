import type { DailyForecast } from '@/services/weather';
import { ForecastCard } from './ForecastCard';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

type ForecastDisplayProps = {
  forecasts: DailyForecast[];
  isLoading: boolean;
  error?: string | null; // Error handled by toast, but kept for potential future use
};

// Skeleton component for loading state
const ForecastSkeletonCard = () => (
    <Card className="w-[120px] h-[210px] flex flex-col items-center p-3">
        <Skeleton className="h-4 w-16 mb-2" /> {/* Date */}
        <Skeleton className="h-10 w-10 rounded-full my-2" /> {/* Icon */}
        <Skeleton className="h-6 w-12 mb-2" /> {/* Temp */}
        <Skeleton className="h-3 w-14 mb-3" /> {/* Condition */}
        <div className="space-y-1 w-full">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
        </div>
    </Card>
);


export function ForecastDisplay({ forecasts, isLoading, error }: ForecastDisplayProps) {
    const hasData = forecasts.length > 0;

    return (
        <div className="w-full mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center md:text-left">
                {isLoading && !hasData ? 'Loading Forecast...' : '15-Day Forecast'}
            </h2>
            {/* Removed explicit error message here, handled by toast */}
            {/* {error && <p className="text-destructive text-center">{error}</p>} */}

            <div className="relative min-h-[240px]"> {/* Container to manage height */}
                {isLoading && !hasData && (
                    <ScrollArea className="w-full whitespace-nowrap rounded-md border opacity-50">
                        <div className="flex w-max space-x-4 p-4 animate-pulse">
                            {Array.from({ length: 7 }).map((_, index) => ( // Show ~7 skeletons
                                <ForecastSkeletonCard key={index} />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}

                {hasData && (
                    <ScrollArea className={cn(
                        "w-full whitespace-nowrap rounded-md border transition-opacity duration-500 ease-in-out",
                        isLoading ? "opacity-50" : "opacity-100", // Fade slightly if loading new data
                         "animate-in fade-in duration-500" // Animate in when ready
                         )}>
                        <div className="flex w-max space-x-4 p-4">
                            {forecasts.map((forecast, index) => (
                                <ForecastCard key={`${forecast.date}-${index}`} forecast={forecast} />
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}

                {!isLoading && !hasData && !error && ( // Show only if not loading, no data, and no error
                    <div className="flex items-center justify-center h-[240px] border rounded-md text-muted-foreground">
                        <p>No forecast data available.</p>
                    </div>
                )}
             </div>
        </div>
    );
}
