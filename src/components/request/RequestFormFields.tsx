
import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  categories, 
  locations, 
  timings 
} from '@/schemas/requestFormSchema';
import { UseFormReturn } from 'react-hook-form';
import { RequestFormValues } from '@/schemas/requestFormSchema';

interface RequestFormFieldsProps {
  form: UseFormReturn<RequestFormValues>;
}

const RequestFormFields: React.FC<RequestFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>כותרת הבקשה</FormLabel>
            <FormControl>
              <Input 
                placeholder="לדוגמה: דרוש חשמלאי להחלפת שקעים" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>קטגוריה</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>מיקום</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="בחר מיקום" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="timing"
        render={({ field }) => (
          <FormItem>
            <FormLabel>עיתוי (לא חובה)</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="בחר עיתוי" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timings.map((timing) => (
                  <SelectItem key={timing} value={timing}>
                    {timing}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>תיאור הבקשה</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="תאר את העבודה הנדרשת בפירוט" 
                className="min-h-[120px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default RequestFormFields;
