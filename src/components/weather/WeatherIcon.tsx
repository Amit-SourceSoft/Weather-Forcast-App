import type { LucideProps } from 'lucide-react';
import { Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudLightning, Wind, Cloudy, Loader2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

type WeatherIconProps = {
  condition?: string; // Make condition optional for loading state
  isLoading?: boolean; // Add isLoading prop
} & LucideProps;

export function WeatherIcon({ condition, isLoading = false, className, ...props }: WeatherIconProps) {
  const lowerCaseCondition = condition?.toLowerCase() || '';

  let IconComponent: React.ComponentType<LucideProps> = Cloud; // Default Icon

  if (isLoading) {
    IconComponent = Loader2;
    className = cn(className, 'animate-spin'); // Add spin animation if loading
  } else if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
    IconComponent = Sun;
  } else if (lowerCaseCondition.includes('partly cloudy') || lowerCaseCondition.includes('mostly sunny')) {
    IconComponent = CloudSun;
  } else if (lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('overcast')) {
    IconComponent = Cloudy; // Using 'Cloudy' for overcast
  } else if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('showers')) {
    IconComponent = CloudRain;
  } else if (lowerCaseCondition.includes('snow')) {
    IconComponent = CloudSnow;
  } else if (lowerCaseCondition.includes('thunderstorm') || lowerCaseCondition.includes('lightning')) {
    IconComponent = CloudLightning;
  } else if (lowerCaseCondition.includes('wind')) {
    IconComponent = Wind;
  }
  // Default icon (Cloud) is already set

  return <IconComponent className={cn("transition-all duration-300 ease-in-out", className)} {...props} />;
}
