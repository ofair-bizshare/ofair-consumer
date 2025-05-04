
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { articleFormSchema, ArticleFormValues } from './articleSchema';
import FormErrorAlert from './FormErrorAlert';
import ImageUploader from './ImageUploader';
import ArticleDetailsFields from './ArticleDetailsFields';
import ArticleContentFields from './ArticleContentFields';
import UploadProgressBar from './UploadProgressBar';
import FormActions from './FormActions';
import { ArticleInterface } from '@/types/dashboard';

interface ArticleFormProps {
  onSuccess?: () => void;
  onSubmit?: (data: ArticleFormValues, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  uploading?: boolean;
  isSubmitting?: boolean;
  setUploading?: (uploading: boolean) => void;
  defaultValues?: ArticleInterface;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ 
  onSuccess, 
  onSubmit,
  onCancel, 
  uploading = false, 
  isSubmitting = false,
  setUploading = () => {},
  defaultValues
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image || null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const isProcessing = uploading || isSubmitting;
  
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: defaultValues ? {
      title: defaultValues.title,
      summary: defaultValues.summary || '',
      content: defaultValues.content,
      author: defaultValues.author || '',
      published: defaultValues.published,
      category: defaultValues.category || ''
    } : {
      title: '',
      summary: '',
      content: '',
      author: '',
      published: true,
      category: 'general'
    }
  });

  useEffect(() => {
    if (defaultValues) {
      console.log('Setting up form with default values:', defaultValues);
      form.reset({
        title: defaultValues.title,
        summary: defaultValues.summary || '',
        content: defaultValues.content,
        author: defaultValues.author || '',
        published: defaultValues.published,
        category: defaultValues.category || ''
      });
      setImagePreview(defaultValues.image || null);
    }
  }, [defaultValues, form]);

  const handleSubmit = async (data: ArticleFormValues) => {
    try {
      setFormError(null);
      setUploadProgress(0);
      console.log('Article form submission starting:', data);
      
      if (onSubmit) {
        console.log('Using provided onSubmit handler');
        await onSubmit(data, imageFile);
        return;
      }
      
      // Legacy submission flow is never reached as we now always provide onSubmit
      setFormError("שגיאה: לא סופק handler לשליחת הטופס");
      toast({
        title: "שגיאה",
        description: "שגיאה בשליחת הטופס, אנא נסה שוב",
        variant: "destructive"
      });
    } catch (error: any) {
      console.error('Error in article submission workflow:', error);
      setFormError(error.message || "אירעה שגיאה בלתי צפויה. אנא נסה שוב מאוחר יותר.");
      toast({
        title: "שגיאה ביצירת מאמר",
        description: error.message || "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      if (setUploading) {
        setUploading(false);
      }
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    
    // Create preview for the selected image
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormErrorAlert error={formError} />
        
        <ArticleDetailsFields form={form} />
        
        <ImageUploader 
          onChange={handleImageChange} 
          initialImage={imagePreview}
        />
        
        <ArticleContentFields form={form} />
        
        <UploadProgressBar 
          progress={uploadProgress} 
          isVisible={uploading || isSubmitting} 
        />
        
        <FormActions 
          onCancel={onCancel}
          isProcessing={isProcessing}
          submitText={defaultValues ? 'עדכן מאמר' : 'צור מאמר'}
        />
      </form>
    </Form>
  );
};

export default ArticleForm;
