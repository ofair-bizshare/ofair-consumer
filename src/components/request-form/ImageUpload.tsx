
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';

interface ImageUploadProps {
  previewUrls: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  images?: File[];
}

const isVideo = (fileUrl: string, file?: File) => {
  if (file && file.type) {
    return file.type.startsWith('video');
  }
  return /\.(mp4|webm|ogg|mov)$/i.test(fileUrl);
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  previewUrls,
  onUpload,
  removeImage,
  images = []
}) => (
  <div className="space-y-2">
    <Label className="text-gray-700">תמונות או וידאו (אופציונלי)</Label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
      <label className="cursor-pointer block">
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">
          לחץ להעלאת תמונות או סרטונים, או גרור לכאן
        </span>
        <input
          type="file"
          className="hidden"
          accept="image/*,video/*"
          multiple
          onChange={onUpload}
        />
      </label>
    </div>
    {previewUrls.length > 0 && (
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {previewUrls.map((url, index) => {
          const file = images?.[index];
          const video = isVideo(url, file);
          return (
            <div key={index} className="relative rounded-md overflow-hidden h-20 bg-gray-100 flex items-center justify-center">
              {video ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  aria-label={`סרטון מספר ${index + 1}`}
                />
              ) : (
                <OptimizedImage
                  src={url}
                  alt={`תמונה מספר ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                  sizes="80px"
                />
              )}
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="הסר קובץ"
                onClick={() => removeImage(index)}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default ImageUpload;
