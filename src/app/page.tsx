
"use client"; // Required for hooks like useState, useEffect, and event handlers

import { useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { LocationControls } from '@/components/weather/LocationControls';
import { Logo } from '@/components/Logo';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils'; // Import cn utility

// Import animation components
import { RainAnimation } from '@/components/animations/RainAnimation';
import { SnowAnimation } from '@/components/animations/SnowAnimation';

export default function Home() {
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    currentCity,
    searchByCity,
    detectLocationAndFetch,
    isUsingApiKey, // Get API key status
  } = useWeather();

  const { toast } = useToast();

  // Fetch weather for current location on initial load
  useEffect(() => {
    // Only fetch if not already loading and no data exists yet
    // This prevents re-fetching if the component re-renders for other reasons
    if (!isLoading && !currentWeather && !error && forecast.length === 0) { // Added check for forecast length
        detectLocationAndFetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once on mount

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const hasData = !!currentWeather || forecast.length > 0;

  // Determine current weather condition for potential animation
  const condition = currentWeather?.conditions?.toLowerCase() || '';
  const showRainAnimation = condition.includes('rain') || condition.includes('shower') || condition.includes('drizzle');
  const showSnowAnimation = condition.includes('snow') || condition.includes('flurries') || condition.includes('sleet');

  return (
    <>
      {/* Conditionally render animations based on weather condition */}
      {showRainAnimation && <RainAnimation />}
      {showSnowAnimation && <SnowAnimation />}
      <main className="relative flex min-h-screen flex-col items-center p-4 md:p-12 bg-gradient-to-br from-background via-primary/10 to-secondary/20 overflow-hidden"> {/* Added relative and overflow-hidden */}
        <header className="w-full max-w-4xl mb-8 flex justify-center">
           <Logo className="h-10 w-auto animate-in fade-in duration-1000" />
        </header>

        {/* Add animation to the main content container */}
        <div className={cn(
             "w-full max-w-4xl flex flex-col items-center gap-6 transition-opacity duration-500 ease-in-out z-10", // Added z-index
             isLoading && !hasData ? "opacity-50" : "opacity-100", // Fade slightly during initial load
             hasData && !isLoading ? "animate-in fade-in-50 slide-in-from-bottom-10 duration-500 ease-out" : "" // Animate in when data arrives
             )}>
          {/* Location Controls */}
          <LocationControls
            onCitySearch={searchByCity}
            onDetectLocation={detectLocationAndFetch}
            isLoading={isLoading}
          />

          {/* Current Weather */}
          <CurrentWeatherCard
            weather={currentWeather}
            city={currentCity}
            isLoading={isLoading}
            isUsingApiKey={isUsingApiKey} // Pass API key status
          />

          {/* 15-Day Forecast */}
          <ForecastDisplay
            forecasts={forecast}
            isLoading={isLoading}
            isUsingApiKey={isUsingApiKey} // Pass API key status
            error={error} // Pass error for potential conditional rendering inside
          />
        </div>
         <footer className="mt-12 text-center text-xs text-muted-foreground animate-in fade-in delay-500 duration-1000 z-10"> {/* Added z-index */}
            Weather data provided by {isUsingApiKey ? 'a real-time API' : 'a simulated API (add NEXT_PUBLIC_WEATHER_API_KEY to .env for real data)'}.
        </footer>
      </main>
      <Toaster /> {/* Add Toaster component here */}
    </>
  );
}
