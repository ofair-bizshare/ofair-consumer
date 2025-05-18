
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface ProfessionSelectProps {
  profession: string;
  professions: string[];
  searchTerm: string;
  filteredProfessions: string[];
  openPopover: boolean;
  setOpenPopover: (open: boolean) => void;
  setSearchTerm: (term: string) => void;
  onChange: (name: string, value: string) => void;
}

const ProfessionSelect: React.FC<ProfessionSelectProps> = ({
  profession,
  professions,
  searchTerm,
  filteredProfessions,
  openPopover,
  setOpenPopover,
  setSearchTerm,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor="profession" className="text-gray-700">סוג עבודה</Label>
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={openPopover} className="w-full justify-between text-right pr-3 pl-10 relative rounded-lg">
          {profession || "בחר סוג עבודה"}
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[230px] bg-white shadow-lg z-50 p-0 border border-gray-300" align="start" style={{
        overflow: 'visible'
      }}>
        <Command dir="rtl">
          <CommandInput placeholder="חפש סוג עבודה..." value={searchTerm} onValueChange={setSearchTerm} className="bg-white" />
          <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
          <CommandList className="bg-white z-50 max-h-64 overflow-auto border-gray-200">
            <CommandGroup>
              {filteredProfessions.map(professionOption => (
                <CommandItem key={professionOption} value={professionOption} onSelect={() => {
                  onChange('profession', professionOption);
                  setSearchTerm('');
                  setOpenPopover(false);
                }}>
                  {professionOption}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
);

export default ProfessionSelect;
