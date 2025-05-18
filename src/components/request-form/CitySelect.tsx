
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface CitySelectProps {
  city: string;
  cities: string[];
  searchTerm: string;
  filteredCities: string[];
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  onChange: (name: string, value: string) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({
  city,
  cities,
  searchTerm,
  filteredCities,
  openPopover,
  setOpenPopover,
  setSearchTerm,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor="location" className="text-gray-700">עיר</Label>
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={openPopover} className="w-full justify-between text-right pr-3 pl-10 relative rounded-lg">
          {city || "בחר עיר"}
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[230px] bg-white shadow-lg z-50 p-0 border border-gray-300" align="start" style={{
        overflow: 'visible'
      }}>
        <Command dir="rtl">
          <CommandInput placeholder="חפש עיר..." value={searchTerm} onValueChange={setSearchTerm} className="bg-white" />
          <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
          <CommandList className="bg-white z-50 max-h-64 overflow-auto border-gray-200">
            <CommandGroup>
              {filteredCities.map(cityOption => (
                <CommandItem key={cityOption} value={cityOption} onSelect={() => {
                  onChange('location', cityOption);
                  setSearchTerm('');
                  setOpenPopover(false);
                }}>
                  {cityOption}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
);

export default CitySelect;
