import { useState } from 'react';
import type { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Loader2 } from 'lucide-react'; // Import Loader2

type LocationControlsProps = {
  onCitySearch: (city: string) => void;
  onDetectLocation: () => void;
  isLoading: boolean;
};

export function LocationControls({ onCitySearch, onDetectLocation, isLoading }: LocationControlsProps) {
  const [cityInput, setCityInput] = useState('');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (cityInput.trim() && !isLoading) { // Prevent search if already loading
      onCitySearch(cityInput.trim());
    }
  };

   const handleDetectLocation = () => {
    if (!isLoading) { // Prevent action if already loading
        onDetectLocation();
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
          disabled={isLoading} // Disable input during loading
          aria-label="City Search Input"
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading || !cityInput.trim()} variant="outline">
          {isLoading ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <Search className="mr-2 h-4 w-4 hidden sm:inline-block" />
          )}
           Search
        </Button>
      </form>
      <Button onClick={handleDetectLocation} disabled={isLoading} variant="secondary">
         {isLoading ? (
             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="mr-2 h-4 w-4" />
         )}
         Use My Location
      </Button>
    </div>
  );
}
