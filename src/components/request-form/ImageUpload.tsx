
import React from 'react';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  previewUrls: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  previewUrls,
  onUpload,
  removeImage
}) => (
  <div className="space-y-2">
    <Label className="text-gray-700">תמונות או וידאו (אופציונלי)</Label>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
      <label className="cursor-pointer block">
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
        <span className="text-sm text-gray-500">לחץ להעלאת תמונות או סרטונים, או גרור לכאן</span>
        <input type="file" className="hidden" accept="image/*,video/*" multiple onChange={onUpload} />
      </label>
    </div>
    {previewUrls.length > 0 && (
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative rounded-md overflow-hidden h-20">
            {url.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <video src={url} className="w-full h-full object-cover" controls />
            ) : (
              <img src={url} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
            )}
            <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => removeImage(index)}>
              ×
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ImageUpload;

