
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRequest } from '@/services/requests';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestCreated?: () => void;
}

// Define the form schema
const requestFormSchema = z.object({
  title: z.string().min(3, {
    message: "כותרת חייבת להכיל לפחות 3 תווים",
  }),
  description: z.string().min(10, {
    message: "תיאור חייב להכיל לפחות 10 תווים",
  }),
  location: z.string().min(2, {
    message: "אנא הזן מיקום תקין",
  }),
  timing: z.string().optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

const RequestDialog: React.FC<RequestDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  onRequestCreated
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      timing: "",
    },
  });

  const handleSubmit = async (values: RequestFormValues) => {
    if (!user) {
      toast({
        title: "שגיאה",
        description: "יש להתחבר כדי ליצור בקשה חדשה",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create request in the database
      const requestId = await createRequest({
        title: values.title,
        description: values.description,
        location: values.location,
        timing: values.timing,
        user_id: user.id
      });
      
      if (requestId) {
        toast({
          title: "בקשה נוצרה בהצלחה",
          description: "בעלי מקצוע יוכלו לשלוח לך הצעות מחיר בקרוב",
          variant: "default",
        });
        
        // Reset form
        form.reset();
        
        // Close dialog
        onOpenChange(false);
        
        // Refresh requests if callback provided
        if (onRequestCreated) {
          onRequestCreated();
        }
      } else {
        throw new Error("Failed to create request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "שגיאה ביצירת הבקשה",
        description: "אירעה שגיאה בעת יצירת הבקשה. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl">יצירת בקשה חדשה</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>כותרת</FormLabel>
                  <FormControl>
                    <Input placeholder="לדוגמה: התקנת מזגן חדש" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תיאור העבודה</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="פרט ככל הניתן את העבודה הנדרשת..." 
                      className="h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מיקום</FormLabel>
                    <FormControl>
                      <Input placeholder="עיר / שכונה" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מתי? (אופציונלי)</FormLabel>
                    <FormControl>
                      <Input placeholder="לדוגמה: בדחיפות, בשבוע הקרוב" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                ביטול
              </Button>
              <Button 
                type="submit" 
                className="bg-[#00D09E] hover:bg-[#00C090]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    שולח...
                  </span>
                ) : (
                  'צור בקשה'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
