
"use client"; // Required for hooks like useState, useEffect, and event handlers

import { useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { LocationControls } from '@/components/weather/LocationControls';
import { Logo } from '@/components/Logo';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    currentCity,
    searchByCity,
    detectLocationAndFetch,
  } = useWeather();

  const { toast } = useToast();

  // Fetch weather for current location on initial load
  useEffect(() => {
    // Only fetch if not already loading and no data exists yet
    // This prevents re-fetching if the component re-renders for other reasons
    if (!isLoading && !currentWeather && !error) {
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

  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-4 md:p-12 bg-gradient-to-br from-background to-secondary/30">
        <header className="w-full max-w-4xl mb-8 flex justify-center">
           <Logo className="h-10 w-auto" />
        </header>

        <div className="w-full max-w-4xl flex flex-col items-center gap-6">
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
            // Error is now handled by toast
            // error={error}
          />

          {/* 15-Day Forecast */}
          <ForecastDisplay
            forecasts={forecast}
            isLoading={isLoading}
             // Error is now handled by toast
            // error={error}
          />
        </div>
         <footer className="mt-12 text-center text-xs text-muted-foreground">
            Weather data provided by a simulated API. Animations not implemented.
        </footer>
      </main>
      <Toaster /> {/* Add Toaster component here */}
    </>
  );
}
