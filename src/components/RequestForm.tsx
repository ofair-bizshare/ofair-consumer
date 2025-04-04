
import React from 'react';
import { Form } from "@/components/ui/form";
import { useRequestForm } from '@/hooks/useRequestForm';
import RequestFormFields from '@/components/request/RequestFormFields';
import RequestFormActions from '@/components/request/RequestFormActions';

interface RequestFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSuccess, onClose }) => {
  const { form, isSubmitting, onSubmit } = useRequestForm({ 
    onSuccess, 
    onClose 
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RequestFormFields form={form} />
        <RequestFormActions 
          onClose={onClose} 
          isSubmitting={isSubmitting} 
        />
      </form>
    </Form>
  );
};

export default RequestForm;
