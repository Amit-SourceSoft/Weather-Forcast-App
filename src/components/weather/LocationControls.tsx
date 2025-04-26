import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';

type LocationControlsProps = {
  onCitySearch: (city: string) => void;
  onDetectLocation: () => void;
  isLoading: boolean;
};

export function LocationControls({ onCitySearch, onDetectLocation, isLoading }: LocationControlsProps) {
  const [cityInput, setCityInput] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      onCitySearch(cityInput.trim());
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
      <form onSubmit={handleSearch} className="flex flex-grow gap-2">
        <Input
          type="text"
          placeholder="Enter city name..."
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          disabled={isLoading}
          aria-label="City Search Input"
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading || !cityInput.trim()} variant="outline">
          <Search className="mr-2 h-4 w-4 hidden sm:inline-block" /> Search
        </Button>
      </form>
      <Button onClick={onDetectLocation} disabled={isLoading} variant="secondary">
        <MapPin className="mr-2 h-4 w-4" /> Use My Location
      </Button>
    </div>
  );
}
