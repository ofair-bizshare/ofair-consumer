
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImageUploaderProps {
  onChange: (file: File | null) => void;
  initialImage?: string | null;
  error?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, initialImage, error }) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(error || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileError(null);
    
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('גודל הקובץ חורג מ-10MB המותרים');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setFileError('סוג הקובץ אינו נתמך. אנא העלה תמונה בפורמט PNG, JPG או WEBP');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    onChange(file);
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
    setFileError(null);
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('גודל הקובץ חורג מ-10MB המותרים');
        return;
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setFileError('סוג הקובץ אינו נתמך. אנא העלה תמונה בפורמט PNG, JPG או WEBP');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      onChange(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileError(null);
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

      {fileError && (
        <Alert variant="destructive" className="mb-2">
          <AlertCircle className="h-4 w-4 ml-2" />
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}

      <Card
        className={`border-2 border-dashed ${
          isDragging ? 'border-primary' : fileError ? 'border-destructive' : 'border-border'
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
