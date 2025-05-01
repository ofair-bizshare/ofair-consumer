
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onChange: (file: File | null) => void;
  initialImage?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, initialImage }) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadError(null);
      const file = e.target.files?.[0] || null;
      
      if (file) {
        console.log('Selected file:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
        
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setUploadError('The file is too large. Maximum size is 10MB.');
          toast({
            title: "קובץ גדול מדי",
            description: "הקובץ גדול מדי. הגודל המקסימלי הוא 10MB",
            variant: "destructive"
          });
          return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Please select an image file (PNG, JPG, WEBP).');
          toast({
            title: "סוג קובץ לא תקין",
            description: "נא לבחור קובץ תמונה (PNG, JPG, WEBP)",
            variant: "destructive"
          });
          return;
        }
        
        onChange(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.onerror = () => {
          setUploadError('Error reading file.');
          toast({
            title: "שגיאה בקריאת הקובץ",
            description: "אירעה שגיאה בקריאת הקובץ",
            variant: "destructive"
          });
        };
        reader.readAsDataURL(file);
      } else {
        onChange(null);
      }
    } catch (error) {
      console.error('Error handling file change:', error);
      setUploadError('Unexpected error handling file.');
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    
    try {
      const file = e.dataTransfer.files?.[0] || null;
      
      if (file) {
        console.log('Dropped file:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');
        
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setUploadError('The file is too large. Maximum size is 10MB.');
          toast({
            title: "קובץ גדול מדי",
            description: "הקובץ גדול מדי. הגודל המקסימלי הוא 10MB",
            variant: "destructive"
          });
          return;
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Please select an image file (PNG, JPG, WEBP).');
          toast({
            title: "סוג קובץ לא תקין",
            description: "נא לבחור קובץ תמונה (PNG, JPG, WEBP)",
            variant: "destructive"
          });
          return;
        }
        
        onChange(file);
        
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.onerror = () => {
          setUploadError('Error reading file.');
          toast({
            title: "שגיאה בקריאת הקובץ",
            description: "אירעה שגיאה בקריאת הקובץ",
            variant: "destructive"
          });
        };
        reader.readAsDataURL(file);
      } else {
        onChange(null);
      }
    } catch (error) {
      console.error('Error handling dropped file:', error);
      setUploadError('Unexpected error handling file.');
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setUploadError(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">תמונת מאמר</div>
        {preview && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleRemoveImage}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-2" />
            הסר תמונה
          </Button>
        )}
      </div>

      <Card
        className={`border-2 border-dashed ${
          isDragging ? 'border-primary' : uploadError ? 'border-red-500' : 'border-border'
        } rounded-lg cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center">
          {preview ? (
            <div className="relative w-full">
              <img
                src={preview}
                alt="תצוגה מקדימה של התמונה"
                className="w-full h-48 object-cover rounded-md"
                onError={() => {
                  console.error('Error loading image preview');
                  setUploadError('Error loading image preview.');
                  setPreview(null);
                }}
              />
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="mb-4 p-2 rounded-full bg-muted">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground mb-1">
                גרור ושחרר תמונה כאן, או לחץ לבחירת קובץ
              </div>
              <div className="text-xs text-muted-foreground">
                PNG, JPG או WEBP עד 10MB
              </div>
            </div>
          )}
          {uploadError && (
            <div className="mt-2 text-sm text-red-500">{uploadError}</div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploader;
