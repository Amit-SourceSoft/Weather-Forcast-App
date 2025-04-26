import type { LucideProps } from 'lucide-react';
import { Sun, Cloud, CloudSun, CloudRain, CloudSnow, CloudLightning, Wind, Cloudy } from 'lucide-react';
import * as React from 'react';

type WeatherIconProps = {
  condition: string;
} & LucideProps;

export function WeatherIcon({ condition, ...props }: WeatherIconProps) {
  const lowerCaseCondition = condition.toLowerCase();

  if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
    return <Sun {...props} />;
  }
  if (lowerCaseCondition.includes('partly cloudy') || lowerCaseCondition.includes('mostly sunny')) {
    return <CloudSun {...props} />;
  }
   if (lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('overcast')) {
    // Using 'Cloudy' as a fallback if 'Cloud' seems too generic for overcast
    return <Cloudy {...props} />;
  }
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('showers')) {
    return <CloudRain {...props} />;
  }
  if (lowerCaseCondition.includes('snow')) {
    return <CloudSnow {...props} />;
  }
  if (lowerCaseCondition.includes('thunderstorm') || lowerCaseCondition.includes('lightning')) {
    return <CloudLightning {...props} />;
  }
  if (lowerCaseCondition.includes('wind')) {
    return <Wind {...props} />;
  }
  // Default icon if no specific condition matches
  return <Cloud {...props} />;
}
