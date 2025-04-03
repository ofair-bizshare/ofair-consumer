
import React from 'react';
import { FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange }) => {
  const { toast } = useToast();

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
      
      onChange(file);
    }
  };

  return (
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
  );
};

export default ImageUploader;
