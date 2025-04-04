
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { createRequest } from '@/services/requests';
import { useAuth } from '@/providers/AuthProvider';

const requestFormSchema = z.object({
  title: z.string().min(3, { message: "כותרת הבקשה חייבת להיות לפחות 3 תווים" }),
  category: z.string({ required_error: "יש לבחור קטגוריה" }),
  location: z.string({ required_error: "יש לבחור מיקום" }),
  timing: z.string().optional(),
  description: z.string().min(10, { message: "תיאור הבקשה חייב להיות לפחות 10 תווים" }),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

interface RequestFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const categories = [
  "שיפוצים",
  "חשמל",
  "אינסטלציה",
  "גינון",
  "ניקיון",
  "הובלות",
  "מזגנים",
  "מחשבים",
  "תיקון מכשירי חשמל",
  "אחר",
];

const locations = [
  "תל אביב והמרכז",
  "ירושלים והסביבה",
  "חיפה והצפון",
  "באר שבע והדרום",
  "אילת",
  "השרון",
  "השפלה",
];

const timings = [
  "מיידי",
  "בימים הקרובים",
  "בשבוע הקרוב",
  "בחודש הקרוב",
  "גמיש",
];

const RequestForm: React.FC<RequestFormProps> = ({ onSuccess, onClose }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      category: "",
      location: "",
      timing: "",
      description: "",
    },
  });

  const onSubmit = async (values: RequestFormValues) => {
    if (!user) {
      toast({
        title: "שגיאה",
        description: "יש להתחבר למערכת כדי ליצור בקשה",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const result = await createRequest({
        title: values.title,
        description: values.description,
        location: values.location,
        timing: values.timing,
        user_id: user.id,
      });
      
      if (result) {
        toast({
          title: "בקשה נוצרה בהצלחה",
          description: "הבקשה שלך נוצרה ונשלחה לבעלי מקצוע מתאימים",
        });
        
        form.reset();
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "שגיאה ביצירת בקשה",
        description: "אירעה שגיאה בעת יצירת הבקשה. אנא נסה שנית.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
        <div className="flex justify-end gap-2 pt-4">
          {onClose && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              ביטול
            </Button>
          )}
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'שולח...' : 'שלח בקשה'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RequestForm;
