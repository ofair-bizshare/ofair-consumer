
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ErrorBoundary from '@/components/ui/error-boundary';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { ZoomIn, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuoteDetailsProps {
  price: string;
  estimatedTime: string;
  description: string;
  mediaUrls?: string[]; // הנחה מפושטת: תמיד מקבל מערך
  sampleImageUrl?: string;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  price,
  estimatedTime,
  description,
  mediaUrls = [],
  sampleImageUrl
}) => {
  const isMobile = useIsMobile();
  const [openMediaIdx, setOpenMediaIdx] = useState<number | null>(null);

  // Log את המדיה שמגיעה מהאב
  console.log("QuoteDetails > mediaUrls received:", mediaUrls);

  // דואגים שהמדיה תהיה תמיד מערך תקין
  const media: string[] = Array.isArray(mediaUrls)
    ? mediaUrls.filter(val => !!val && val !== "null" && val !== "undefined")
    : [];

  // אם אין בכלל מדיה ויש sampleImageUrl, מוסיפים אותו
  const allMedia = media.length > 0
    ? media
    : (sampleImageUrl && sampleImageUrl.startsWith('http') ? [sampleImageUrl] : []);

  console.log('QuoteDetails > after fallback:', allMedia);

  const isImage = (url: string) =>
    /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url);

  const isVideo = (url: string) =>
    /\.(mp4|webm|ogg|mov)$/i.test(url);

  const formattedPrice = price && price !== '0' && price !== '' ? price : '0';

  return (
    <ErrorBoundary fallback={<div className="p-2 bg-red-50 rounded text-sm">שגיאה בטעינת פרטי ההצעה</div>}>
      <div className="mt-2 space-y-2">
        {allMedia.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-3 items-center">
            {allMedia.map((src, i) => (
              <div key={src + i} className="relative inline-block group">
                {isImage(src) ? (
                  <img
                    src={src}
                    alt={`מדיום #${i + 1}`}
                    className="rounded-md max-h-16 object-cover cursor-zoom-in border border-gray-200 shadow hover:shadow-lg transition"
                    onClick={() => setOpenMediaIdx(i)}
                    loading="lazy"
                    style={{
                      maxWidth: 120,
                      minWidth: 80
                    }}
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                    }}
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
                    מדיה לא מזוהה, הצג קישור
                  </a>
                )}
                <Button
                  type="button"
                  size="icon"
                  className="absolute left-1 bottom-1 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 shadow border border-gray-300 group-hover:scale-105"
                  onClick={() => setOpenMediaIdx(i)}
                  aria-label="הצג מדיה בגודל מלא"
                >
                  <ZoomIn className="text-blue-600 w-4 h-4" />
                </Button>
              </div>
            ))}
            {/* Dialog for viewing current media in large */}
            {openMediaIdx !== null && (
              <Dialog open={openMediaIdx !== null} onOpenChange={() => setOpenMediaIdx(null)}>
                <DialogContent className="max-w-3xl bg-white shadow-2xl z-50 rounded-xl flex flex-col items-center">
                  <DialogHeader>
                    <DialogTitle>
                      <div className="flex items-center gap-2 text-lg">
                        {isImage(allMedia[openMediaIdx]) ? (
                          <Image className="w-6 h-6 text-blue-500" />
                        ) : isVideo(allMedia[openMediaIdx]) ? (
                          <Video className="w-6 h-6 text-blue-500" />
                        ) : (
                          <Image className="w-6 h-6 text-blue-500" />
                        )}
                        תצוגה במדיה בגודל מלא
                      </div>
                    </DialogTitle>
                    <DialogDescription>
                      לחץ מחוץ למדיה לסגירה
                    </DialogDescription>
                  </DialogHeader>
                  <div className="w-full flex justify-center my-2">
                    {isImage(allMedia[openMediaIdx]) ? (
                      <img
                        src={allMedia[openMediaIdx]}
                        alt={`המדיה #${openMediaIdx + 1}`}
                        className="rounded-lg shadow max-h-[70vh] max-w-full border border-gray-200"
                        loading="lazy"
                      />
                    ) : isVideo(allMedia[openMediaIdx]) ? (
                      <video controls className="max-h-[70vh] rounded-lg border border-gray-200">
                        <source src={allMedia[openMediaIdx]} />
                        הדפדפן שלך אינו תומך בניגון וידאו.
                      </video>
                    ) : (
                      <a
                        href={allMedia[openMediaIdx]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs block"
                        title={allMedia[openMediaIdx]}>
                        מדיה לא מזוהה, הצג קישור
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
        ) : null}
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
            <p className="line-clamp-3 text-lg font-semibold text-inherit">{description}</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default QuoteDetails;
