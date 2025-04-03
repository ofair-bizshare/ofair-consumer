
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { uploadArticleImage } from '@/services/articles';
import { createArticle } from '@/services/admin';
import { Form } from '@/components/ui/form';
import { articleFormSchema, ArticleFormValues } from './articleSchema';
import FormErrorAlert from './FormErrorAlert';
import ImageUploader from './ImageUploader';
import ArticleDetailsFields from './ArticleDetailsFields';
import ArticleContentFields from './ArticleContentFields';
import UploadProgressBar from './UploadProgressBar';
import FormActions from './FormActions';

interface ArticleFormProps {
  onSuccess?: () => void;
  onSubmit?: (data: ArticleFormValues, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  uploading?: boolean;
  isSubmitting?: boolean;
  setUploading?: (uploading: boolean) => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ 
  onSuccess, 
  onSubmit,
  onCancel, 
  uploading = false, 
  isSubmitting = false,
  setUploading = () => {} 
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { toast } = useToast();
  const isProcessing = uploading || isSubmitting;
  
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      author: '',
      published: true
    }
  });

  const handleSubmit = async (data: ArticleFormValues) => {
    try {
      setFormError(null);
      setUploadProgress(0);
      
      if (onSubmit) {
        await onSubmit(data, imageFile);
        return;
      }
      
      // Legacy submission flow
      setUploading(true);
      
      // Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        try {
          setUploadProgress(10);
          const uploadedUrl = await uploadArticleImage(imageFile);
          setUploadProgress(50);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast({
            title: "שגיאה בהעלאת תמונה",
            description: "התמונה לא הועלתה, אבל נמשיך ביצירת המאמר ללא תמונה",
            variant: "destructive"
          });
          imageUrl = 'https://via.placeholder.com/800x400?text=תמונה+לא+זמינה';
        }
      } else {
        imageUrl = 'https://via.placeholder.com/800x400?text=אין+תמונה';
      }
      
      setUploadProgress(70);
      
      // Create article
      const article = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        published: data.published,
        image: imageUrl
      };
      
      console.log("Submitting article:", article);
      
      try {
        const result = await createArticle(article);
        setUploadProgress(100);
        
        if (result) {
          console.log("Article created successfully:", result);
          toast({
            title: "מאמר נוצר בהצלחה",
            description: `המאמר "${data.title}" נוסף בהצלחה`
          });
          
          // Reset form and close dialog
          form.reset();
          setImageFile(null);
          if (onSuccess) onSuccess();
        } else {
          throw new Error("Failed to create article, no result returned");
        }
      } catch (createError) {
        console.error('Error creating article:', createError);
        setFormError("אירעה שגיאה ביצירת המאמר. אנא נסה שנית.");
        toast({
          title: "שגיאה ביצירת מאמר",
          description: "אירעה שגיאה בעת יצירת המאמר. אנא נסה שנית.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in article submission workflow:', error);
      setFormError("אירעה שגיאה בלתי צפויה. אנא נסה שנית.");
      toast({
        title: "שגיאה ביצירת מאמר",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormErrorAlert error={formError} />
        
        <ArticleDetailsFields form={form} />
        
        <ImageUploader onChange={setImageFile} />
        
        <ArticleContentFields form={form} />
        
        <UploadProgressBar 
          progress={uploadProgress} 
          isVisible={uploading || isSubmitting} 
        />
        
        <FormActions 
          onCancel={onCancel} 
          isProcessing={isProcessing} 
        />
      </form>
    </Form>
  );
};

export default ArticleForm;
