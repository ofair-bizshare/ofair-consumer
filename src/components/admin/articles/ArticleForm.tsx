
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

const articleFormSchema = z.object({
  title: z.string().min(5, { message: 'כותרת חייבת להכיל לפחות 5 תווים' }),
  summary: z.string().min(20, { message: 'תקציר חייב להכיל לפחות 20 תווים' }),
  content: z.string().min(50, { message: 'תוכן חייב להכיל לפחות 50 תווים' }),
  author: z.string().min(2, { message: 'שם המחבר חייב להכיל לפחות 2 תווים' }),
  published: z.boolean().default(true)
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ 
  onSuccess, 
  onCancel, 
  uploading, 
  setUploading 
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  
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
      setImageFile(file);
    }
  };

  const onSubmit = async (data: ArticleFormValues) => {
    try {
      setUploading(true);
      
      // Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        const uploadedUrl = await uploadArticleImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      // Create article
      const article = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        published: data.published,
        image: imageUrl
      };
      
      const result = await createArticle(article);
      
      if (result) {
        toast({
          title: "מאמר נוצר בהצלחה",
          description: `המאמר "${data.title}" נוסף בהצלחה`
        });
        
        // Reset form and close dialog
        form.reset();
        setImageFile(null);
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating article:', error);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        
        <div className="flex justify-end mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="mr-2"
            disabled={uploading}
          >
            ביטול
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'מעלה...' : 'הוסף מאמר'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleForm;
