
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ArticleFormValues } from './articleSchema';
import RichTextEditor from './RichTextEditor';

interface ArticleContentFieldsProps {
  form: UseFormReturn<ArticleFormValues>;
}

const ArticleContentFields: React.FC<ArticleContentFieldsProps> = ({ form }) => {
  return (
    <>
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
              <RichTextEditor 
                content={field.value} 
                onChange={field.onChange}
                placeholder="תוכן המאמר המלא"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ArticleContentFields;
