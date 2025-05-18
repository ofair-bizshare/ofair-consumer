
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
  mediaUrls?: string[] | string; // קיימים גם מערך וגם מחרוזת
  sampleImageUrl?: string;
}

const QuoteDetails: React.FC<QuoteDetailsProps> = ({
  price,
  estimatedTime,
  description,
  mediaUrls,
  sampleImageUrl
}) => {
  const isMobile = useIsMobile();
  const [openMediaIdx, setOpenMediaIdx] = useState<number | null>(null);

  // Debug: בדוק איזה mediaUrls התקבלו
  console.log("QuoteDetails > mediaUrls prop:", mediaUrls);

  let media: string[] = [];

  if (Array.isArray(mediaUrls)) {
    media = mediaUrls.filter(val => typeof val === 'string' && !!val && val !== "null");
  } else if (typeof mediaUrls === 'string') {
    const clean = mediaUrls.trim();
    // מאמץ ראשון - JSON
    try {
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed)) {
        media = parsed.filter(val => typeof val === "string" && !!val && val !== "null");
      } else if (typeof parsed === "string" && !!parsed && parsed !== "null") {
        media = [parsed];
      }
    } catch {
      // לא JSON? ננסה לפרק עם פסיקים 
      if (clean.includes(',')) {
        media = clean.split(',').map(s => s.trim()).filter(Boolean).filter(x => x !== "null");
      } else if (
        clean.startsWith('http') && clean.length > 8 // בדיקה מינימלית לכתובת
      ) {
        media = [clean];
      }
    }
  } else if (sampleImageUrl) {
    media = [sampleImageUrl];
  }

  // ניקוי סופי מתווים ריקים/null
  media = media.filter(Boolean).filter(x => x !== "null");

  // למעקב ב-console
  console.log("QuoteDetails > media after processing:", media);

  const isImage = (url: string) =>
    /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(url);

  const isVideo = (url: string) =>
    /\.(mp4|webm|ogg|mov)$/i.test(url);

  const formattedPrice = price && price !== '0' && price !== '' ? price : '0';

  return (
    <ErrorBoundary fallback={<div className="p-2 bg-red-50 rounded text-sm">שגיאה בטעינת פרטי ההצעה</div>}>
      <div className="mt-2 space-y-2">
        {/* Media Gallery */}
        {media.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-3 items-center">
            {media.map((src, i) => (
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
                ) : null}
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
                        {isImage(media[openMediaIdx]) ? (
                          <Image className="w-6 h-6 text-blue-500" />
                        ) : (
                          <Video className="w-6 h-6 text-blue-500" />
                        )}
                        תצוגה במדיה בגודל מלא
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
                        alt={`המדיה #${openMediaIdx + 1}`}
                        className="rounded-lg shadow max-h-[70vh] max-w-full border border-gray-200"
                        loading="lazy"
                      />
                    ) : isVideo(media[openMediaIdx]) ? (
                      <video controls className="max-h-[70vh] rounded-lg border border-gray-200">
                        <source src={media[openMediaIdx]} />
                        הדפדפן שלך אינו תומך בניגון וידאו.
                      </video>
                    ) : null}
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
