
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { createRequest } from '@/services/requests';
import { requestFormSchema, RequestFormValues } from '@/schemas/requestFormSchema';

interface UseRequestFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const useRequestForm = ({ onSuccess, onClose }: UseRequestFormProps = {}) => {
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

  return {
    form,
    isSubmitting,
    onSubmit,
    onClose,
  };
};
