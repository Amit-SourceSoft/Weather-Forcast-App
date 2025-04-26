"use client"; // Required for hooks like useState, useEffect, and event handlers

import { useWeather } from '@/hooks/useWeather';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { LocationControls } from '@/components/weather/LocationControls';
import { Logo } from '@/components/Logo';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { useEffect } from 'react';

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

  const { toast } = useToast(); // Get the toast function

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
            // We handle error display via toast now, but can keep this for specific card errors if needed
            // error={error}
          />

          {/* 15-Day Forecast */}
          <ForecastDisplay
            forecasts={forecast}
            isLoading={isLoading}
             // We handle error display via toast now
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
