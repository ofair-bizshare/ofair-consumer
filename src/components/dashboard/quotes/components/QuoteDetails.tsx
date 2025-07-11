import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from '@/components/ui/error-boundary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ZoomIn, Image, Video, ImageOff, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteDetailsProps {
  price: string;
  estimatedTime: string;
  description: string;
  mediaUrls?: string[];
  sampleImageUrl?: string;
}

// Component for description with read more functionality
const DescriptionWithReadMore: React.FC<{ description: string }> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowReadMore = description.length > 150;
  
  const displayText = isExpanded ? description : (shouldShowReadMore ? description.substring(0, 150) + '...' : description);
  
  return (
    <div className="mt-1">
      <p className="text-lg font-semibold text-inherit whitespace-pre-wrap">
        {displayText}
      </p>
      {shouldShowReadMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 ml-1" />
              קרא פחות
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 ml-1" />
              קרא עוד
            </>
          )}
        </Button>
      )}
    </div>
  );
};

// A small component to handle image loading and error states gracefully.
const ImageThumbnail: React.FC<{ src: string; alt: string; onClick: () => void }> = ({ src, alt, onClick }) => {
  const [hasError, setHasError] = useState(false);

  // If the image fails to load, show a placeholder.
  if (hasError) {
    return (
      <div
        onClick={onClick}
        className="w-[120px] h-[64px] rounded-md bg-gray-100 flex flex-col items-center justify-center border border-gray-200 shadow cursor-pointer text-gray-500"
        title="התמונה לא זמינה"
      >
        <ImageOff className="w-7 h-7" />
        <span className="text-xs mt-1">תמונה לא זמינה</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="rounded-md max-h-16 object-cover cursor-zoom-in border border-gray-200 shadow hover:shadow-lg transition bg-gray-50"
      onClick={onClick}
      loading="lazy"
      style={{
        maxWidth: 120,
        minWidth: 80,
      }}
      onError={() => setHasError(true)}
    />
  );
};

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  price,
  estimatedTime,
  description,
  mediaUrls = [],
}) => {
  const isMobile = useIsMobile();
  const [openMediaIdx, setOpenMediaIdx] = useState<number | null>(null);

  console.log("QuoteDetails > mediaUrls received:", mediaUrls);

  // CRITICAL FIX: Removed the redundant, strict filtering logic.
  // We now trust the `mediaUrls` prop, which is processed by the `useMediaUrls` hook.
  const media: string[] = mediaUrls;

  console.log('QuoteDetails > filtered media:', media);

  const isImage = (url: string) =>
    /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url) || url.startsWith('data:image/');

  const isVideo = (url:string) =>
    /\.(mp4|webm|ogg|mov)$/i.test(url) || url.startsWith('data:video/');

  const formattedPrice = price && price !== '0' && price !== '' ? price : '0';

  return (
    <ErrorBoundary fallback={<div className="p-2 bg-red-50 rounded text-sm">שגיאה בטעינת פרטי ההצעה</div>}>
      <div className="mt-2 space-y-2">
        {media.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-gray-700">קבצי מדיה:</span>
            {media.map((src, i) => (
              <div key={src + i} className="relative inline-block group">
                {isImage(src) ? (
                  <ImageThumbnail
                    src={src}
                    alt={`תמונה #${i + 1}`}
                    onClick={() => setOpenMediaIdx(i)}
                  />
                ) : isVideo(src) ? (
                  <div
                    className="w-[120px] h-[64px] rounded-md bg-gray-200 flex items-center justify-center border border-gray-200 shadow hover:shadow-lg cursor-pointer"
                    onClick={() => setOpenMediaIdx(i)}
                    title="לחץ לצפייה בוידאו">
                    <Video className="w-7 h-7 text-blue-600" />
                    <span className="sr-only">צפייה בוידאו</span>
                  </div>
                ) : (
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs block max-w-[120px] truncate underline mt-2 border border-gray-200 shadow"
                    title={src}>
                    קובץ מדיה
                  </a>
                )}
                <Button
                  type="button"
                  size="icon"
                  className="absolute left-1 bottom-1 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 shadow border border-gray-300 group-hover:scale-105 w-6 h-6"
                  onClick={() => setOpenMediaIdx(i)}
                  aria-label="הצג מדיה בגודל מלא"
                >
                  <ZoomIn className="text-blue-600 w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
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
          <DescriptionWithReadMore description={description} />
        )}
        
        {/* Dialog for viewing media in large */}
        {openMediaIdx !== null && media[openMediaIdx] && (
          <Dialog open={openMediaIdx !== null} onOpenChange={() => setOpenMediaIdx(null)}>
            <DialogContent className="max-w-3xl bg-white shadow-2xl z-50 rounded-xl flex flex-col items-center">
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center gap-2 text-lg">
                    {isImage(media[openMediaIdx]) ? (
                      <Image className="w-6 h-6 text-blue-500" />
                    ) : isVideo(media[openMediaIdx]) ? (
                      <Video className="w-6 h-6 text-blue-500" />
                    ) : (
                      <Image className="w-6 h-6 text-blue-500" />
                    )}
                    תצוגת מדיה בגודל מלא
                  </div>
                </DialogTitle>
                <DialogDescription>
                  לחץ מחוץ למדיה לסגירה
                </DialogDescription>
              </DialogHeader>
              <div className="w-full flex justify-center my-2">
                {isImage(media[openMediaIdx]) ? (
                  <img
                    src={media[openMediaIdx]}
                    alt={`תמונה #${openMediaIdx + 1}`}
                    className="rounded-lg shadow max-h-[70vh] max-w-full border border-gray-200"
                    loading="lazy"
                  />
                ) : isVideo(media[openMediaIdx]) ? (
                  <video controls className="max-h-[70vh] rounded-lg border border-gray-200">
                    <source src={media[openMediaIdx]} />
                    הדפדפן שלך אינו תומך בניגון וידאו.
                  </video>
                ) : (
                  <a
                    href={media[openMediaIdx]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs block"
                    title={media[openMediaIdx]}>
                    קובץ מדיה
                  </a>
                )}
              </div>
              <DialogClose asChild>
                <Button variant="outline" className="mt-2">סגור</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default QuoteDetails;
