import type { LucideProps } from 'lucide-react';
import {
    Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudLightning, Wind, Cloudy, Haze, CloudFog, CloudDrizzle, Tornado, Snowflake, CloudSunRain, CloudMoon, Moon, Loader2 // Added Loader2
} from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image'; // Import next/image for API icons

type WeatherIconProps = {
  condition?: string; // General condition text
  iconCode?: string; // API-specific icon code (e.g., '01d' from OpenWeatherMap)
  isLoading?: boolean; // Add isLoading prop
  isUsingApiKey?: boolean; // Indicate if API key is active
} & Omit<LucideProps, 'ref'>; // Omit ref as it's handled internally or by wrapper

// Mapping from common condition terms to Lucide icons (used as fallback)
const conditionToIconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  sun: Sun,
  clear: Sun,
  cloud: Cloud,
  cloudy: Cloudy,
  'partly cloudy': CloudSun,
  'mostly sunny': CloudSun,
  'mostly cloudy': Cloud,
  rain: CloudRain,
  drizzle: CloudDrizzle,
  showers: CloudSunRain,
  snow: CloudSnow,
  snowflake: Snowflake,
  thunderstorm: CloudLightning,
  lightning: CloudLightning,
  wind: Wind,
  fog: CloudFog,
  haze: Haze,
  mist: CloudFog,
  tornado: Tornado,
  moon: Moon,
  'clear night': Moon,
  'cloudy night': CloudMoon,
  // Add more specific mappings as needed
};

// Define the base URL for OpenWeatherMap icons
const OWM_ICON_BASE_URL = 'https://openweathermap.org/img/wn/';

export function WeatherIcon({
    condition,
    iconCode,
    isLoading = false,
    isUsingApiKey = false, // Default to false if not provided
    className,
    ...props // Spread remaining props (like size)
}: WeatherIconProps) {
  const lowerCaseCondition = condition?.toLowerCase() || '';

  // 1. Handle Loading State
  if (isLoading) {
    // Render a loading indicator (optional, parent might handle it)
    return <Loader2 className={cn('animate-spin', className)} {...props} />;
    // return null; // Or let parent show loading state
  }

  // 2. Use Real API Icon if available and API key is used
  if (isUsingApiKey && iconCode) {
    const iconUrl = `${OWM_ICON_BASE_URL}${iconCode}@2x.png`;
    // Ensure size prop is handled correctly for next/image
    const size = typeof props.size === 'number' ? props.size : 50; // Default size if not provided

    return (
      <Image
        src={iconUrl}
        alt={condition || 'Weather icon'}
        width={size}
        height={size}
        className={cn("transition-all duration-300 ease-in-out", className)} // Apply className here
        // Pass other compatible props, filter out incompatible LucideProps if necessary
        // Example: title might be useful
        title={condition} // Add title attribute for better accessibility/tooltip
        unoptimized // Prevent potential issues with external image optimization if not configured
      />
    );
  }

  // 3. Fallback to Lucide Icons based on condition text
  let IconComponent: React.ComponentType<LucideProps> | null = null;

  // Find the first matching keyword in the map
  const matchedKeyword = Object.keys(conditionToIconMap).find(keyword =>
    lowerCaseCondition.includes(keyword)
  );

  IconComponent = matchedKeyword ? conditionToIconMap[matchedKeyword] : Cloudy; // Default to Cloudy if no match

  // Render the determined Lucide icon
  return <IconComponent className={cn("transition-all duration-300 ease-in-out", className)} {...props} />;
}
