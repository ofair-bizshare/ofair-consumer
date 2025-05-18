
import React from 'react';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface TimingPickerProps {
  timing: string;
  openCalendar: boolean;
  setOpenCalendar: (open: boolean) => void;
  selectedDate: Date | undefined;
  handleSelectDate: (date: Date | undefined) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimingPicker: React.FC<TimingPickerProps> = ({
  timing,
  openCalendar,
  setOpenCalendar,
  selectedDate,
  handleSelectDate,
  handleInputChange
}) => (
  <div className="space-y-2">
    <Label htmlFor="timing" className="text-gray-700">מועד ביצוע (אופציונלי)</Label>
    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input id="timing" name="timing" placeholder="מתי תרצה שהעבודה תתבצע?" value={timing} onChange={handleInputChange} onClick={() => setOpenCalendar(true)} readOnly className="pr-10 rounded-lg" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto z-50 bg-white" align="start">
        <CalendarComponent mode="single" selected={selectedDate} onSelect={handleSelectDate} className="border rounded-md p-3 pointer-events-auto bg-white z-50" disabled={date => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date < today;
        }} initialFocus />
      </PopoverContent>
    </Popover>
  </div>
);

export default TimingPicker;
