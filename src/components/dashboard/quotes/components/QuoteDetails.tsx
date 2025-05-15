
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from '@/components/ui/error-boundary';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { Maximize2, ZoomIn, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteDetailsProps {
  price: string;
  estimatedTime: string;
  description: string;
  sampleImageUrl?: string;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  price,
  estimatedTime,
  description,
  sampleImageUrl
}) => {
  const isMobile = useIsMobile();
  const [showImageDialog, setShowImageDialog] = useState(false);

  // Format price to show properly with safer handling
  const formattedPrice = price && price !== "0" && price !== "" ? price : "0";

  return (
    <ErrorBoundary fallback={<div className="p-2 bg-red-50 rounded text-sm">שגיאה בטעינת פרטי ההצעה</div>}>
      <div className="mt-2 space-y-2">
        <div className={`flex ${isMobile ? 'flex-col gap-1' : 'flex-row gap-6 space-x-reverse'}`}>
          <div className="flex items-center">
            <span className="font-semibold ml-2 text-sm">מחיר:</span>
            <span className="text-blue-600 font-medium text-sm">₪{formattedPrice}</span>
          </div>

          {estimatedTime && (
            <div className="flex items-center">
              <span className="font-semibold ml-2 text-sm">זמן משוער:</span>
              <span className="text-sm">{estimatedTime}</span>
            </div>
          )}
        </div>

        {description && (
          <div className="mt-1">
            <p className="text-gray-700 text-xs line-clamp-3">{description}</p>
          </div>
        )}

        {sampleImageUrl && (
          <div className="mt-2">
            {/* תמונה ממוזערת + כפתור הגדלת תמונה */}
            <div className="relative inline-block">
              <img
                src={sampleImageUrl}
                alt="דוגמת עבודה"
                className="rounded-md max-h-16 object-cover cursor-zoom-in border border-gray-200 shadow hover:shadow-lg transition"
                onClick={() => setShowImageDialog(true)}
                title="להגדלה לחץ על התמונה"
                onError={e => { e.currentTarget.style.display = 'none'; }}
                loading="lazy"
                style={{ maxWidth: 120, minWidth: 80 }}
              />
              <Button
                type="button"
                size="icon"
                className="absolute left-1 bottom-1 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 shadow border border-gray-300"
                onClick={() => setShowImageDialog(true)}
                aria-label="הצג תמונה בגודל מלא"
              >
                <ZoomIn className="text-blue-600 w-4 h-4" />
              </Button>
            </div>
            {/* דיאלוג הצגת תמונה */}
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogContent className="max-w-3xl bg-white shadow-2xl z-50 rounded-xl flex flex-col items-center">
                <DialogHeader>
                  <DialogTitle>
                    <div className="flex items-center gap-2 text-lg">
                      <Image className="w-6 h-6 text-blue-500" />
                      תצוגה בגודל מלא
                    </div>
                  </DialogTitle>
                  <DialogDescription>
                    לחץ מחוץ לתמונה לסגירה
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full flex justify-center my-2">
                  <img
                    src={sampleImageUrl}
                    alt="דוגמת עבודה בגודל מלא"
                    className="rounded-lg shadow max-h-[70vh] max-w-full border border-gray-200"
                    loading="lazy"
                  />
                </div>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="mt-2"
                  >סגור</Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default QuoteDetails;

