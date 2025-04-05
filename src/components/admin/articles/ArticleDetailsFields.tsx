
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { ArticleFormValues } from './articleSchema';
import { articleCategoryOptions } from './articleSchema';

interface ArticleDetailsFieldsProps {
  form: UseFormReturn<ArticleFormValues>;
}

const ArticleDetailsFields: React.FC<ArticleDetailsFieldsProps> = ({ form }) => {
  return (
    <>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>מחבר</FormLabel>
              <FormControl>
                <Input placeholder="שם מחבר המאמר" {...field} />
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
              <FormControl>
                <select 
                  className="w-full h-10 px-3 py-2 text-base rounded-md border border-input bg-background"
                  {...field}
                >
                  <option value="">בחר קטגוריה</option>
                  {articleCategoryOptions.map((category) => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="published"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>פרסם מאמר</FormLabel>
              <div className="text-sm text-muted-foreground">
                האם לפרסם את המאמר באתר כרגע?
              </div>
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
    </>
  );
};

export default ArticleDetailsFields;
