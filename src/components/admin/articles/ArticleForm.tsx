
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { uploadArticleImage } from '@/services/articles';
import { createArticle } from '@/services/admin';

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const articleFormSchema = z.object({
  title: z.string().min(5, { message: 'כותרת חייבת להכיל לפחות 5 תווים' }),
  summary: z.string().min(20, { message: 'תקציר חייב להכיל לפחות 20 תווים' }),
  content: z.string().min(50, { message: 'תוכן חייב להכיל לפחות 50 תווים' }),
  author: z.string().min(2, { message: 'שם המחבר חייב להכיל לפחות 2 תווים' }),
  published: z.boolean().default(true)
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size - 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "קובץ גדול מדי",
          description: "גודל הקובץ לא יכול לעלות על 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
    }
  };

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
        {formError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>כותרת</FormLabel>
              <FormControl>
                <Input placeholder="כותרת המאמר" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מחבר</FormLabel>
                <FormControl>
                  <Input placeholder="שם המחבר" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>פרסום</FormLabel>
                  <FormDescription>
                    האם לפרסם את המאמר באתר
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <FormItem>
          <FormLabel>תמונה</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </FormControl>
          <FormDescription>
            העלה תמונה ראשית למאמר (מומלץ בגודל 800x400). מוגבל ל-5MB.
          </FormDescription>
          <FormMessage />
        </FormItem>
        
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תקציר</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="תקציר קצר של המאמר (יוצג בתצוגת הרשימה)"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>תוכן</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="תוכן המאמר המלא"
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {(uploading || isSubmitting) && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="mr-2"
            disabled={isProcessing}
          >
            ביטול
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing ? 'מעלה...' : 'הוסף מאמר'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleForm;
