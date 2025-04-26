import type { LucideProps } from 'lucide-react';
import {
    Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudLightning, Wind, Cloudy, Haze, CloudFog, CloudDrizzle, Tornado, Snowflake, CloudSunRain, CloudMoon, Moon
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Import next/image for API icons

type WeatherIconProps = {
  condition?: string; // General condition text
  iconCode?: string; // API-specific icon code (e.g., '01d' from OpenWeatherMap)
  isLoading?: boolean; // Add isLoading prop
} & Omit<LucideProps, 'ref'>; // Omit ref as it's handled internally or by wrapper

// Simple mapping from common condition terms to Lucide icons
// Prioritize API iconCode if available
const conditionToIconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  sun: Sun,
  clear: Sun, // Often used interchangeably with sunny
  cloud: Cloud,
  cloudy: Cloudy,
  'partly cloudy': CloudSun,
  'mostly sunny': CloudSun,
  'mostly cloudy': Cloud, // Can refine this
  rain: CloudRain,
  drizzle: CloudDrizzle,
  showers: CloudSunRain, // Or CloudRain
  snow: CloudSnow,
  snowflake: Snowflake,
  thunderstorm: CloudLightning,
  lightning: CloudLightning,
  wind: Wind,
  fog: CloudFog,
  haze: Haze,
  mist: CloudFog,
  tornado: Tornado,
  moon: Moon, // For night conditions
  'clear night': Moon,
  'cloudy night': CloudMoon,
};

// Example mapping for OpenWeatherMap icon codes to Lucide icons
// Ref: https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
const owmIconMap: { [key: string]: React.ComponentType<LucideProps> } = {
    '01d': Sun, '01n': Moon,
    '02d': CloudSun, '02n': CloudMoon,
    '03d': Cloud, '03n': Cloud, // Scattered clouds
    '04d': Cloudy, '04n': Cloudy, // Broken clouds / Overcast
    '09d': CloudRain, '09n': CloudRain, // Shower rain
    '10d': CloudSunRain, '10n': CloudRain, // Rain (adjust night?)
    '11d': CloudLightning, '11n': CloudLightning, // Thunderstorm
    '13d': CloudSnow, '13n': CloudSnow, // Snow
    '50d': Haze, '50n': CloudFog, // Mist/Fog/Haze
    // Default fallback
    default: Cloud,
}

export function WeatherIcon({ condition, iconCode, isLoading = false, className, ...props }: WeatherIconProps) {
  const lowerCaseCondition = condition?.toLowerCase() || '';
  let IconComponent: React.ComponentType<LucideProps> | null = null;
  let useApiIcon = false;

  // --- Determine Icon ---
  if (isLoading) {
    // Handle loading state separately if needed, or let parent handle it
    // return <Loader2 className={cn('animate-spin', className)} {...props} />;
    return null; // Or a placeholder skeleton
  }

  // 1. Prioritize API Icon Code (if available and provider is known, e.g., OpenWeatherMap)
  if (iconCode) {
      // Assuming OpenWeatherMap for this example:
      const owmIconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      // If you prefer Lucide icons even with API code, map it:
      // IconComponent = owmIconMap[iconCode] || owmIconMap.default;

      // Set flag to use Next Image with the API icon URL
      useApiIcon = true;
       return (
        <Image
          src={owmIconUrl}
          alt={condition || 'Weather icon'}
          width={props.size || 50} // Adjust default size as needed
          height={props.size || 50}
          className={cn("transition-all duration-300 ease-in-out", className)}
          // {...props} // Pass other compatible props if needed, careful with spreading LucideProps here
        />
      );
  }


  // 2. Fallback to condition text mapping if no API icon code
  if (!useApiIcon) {
      // Find the first matching keyword in the map
      const matchedKeyword = Object.keys(conditionToIconMap).find(keyword =>
          lowerCaseCondition.includes(keyword)
      );
      IconComponent = matchedKeyword ? conditionToIconMap[matchedKeyword] : Cloud; // Default to Cloud
  }


  // --- Render ---
  if (IconComponent) {
      return <IconComponent className={cn("transition-all duration-300 ease-in-out", className)} {...props} />;
  }

  // Fallback if no icon determined (should ideally not happen with defaults)
  return <Cloud className={cn("transition-all duration-300 ease-in-out text-muted-foreground", className)} {...props} />;
}
