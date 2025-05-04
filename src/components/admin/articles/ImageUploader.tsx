
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onChange: (file: File | null) => void;
  initialImage?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, initialImage }) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    
    const file = e.dataTransfer.files?.[0] || null;
    onChange(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setPreview(null);
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
          isDragging ? 'border-primary' : 'border-border'
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
