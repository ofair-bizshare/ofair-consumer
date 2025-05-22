
import { useMemo } from "react";
import { QuoteInterface } from "@/types/dashboard";

/**
 * Returns an array of valid media URLs from a quote, handling strings, arrays, or JSON.
 */
export function useMediaUrls(quote: QuoteInterface): string[] {
  return useMemo(() => {
    let mediaUrls: string[] = [];
    const rawMedia = quote.media_urls;

    // Helper: Type guard for string arrays
    const isStringArray = (arr: unknown): arr is string[] =>
      Array.isArray(arr) && arr.every(item => typeof item === "string");

    if (Array.isArray(rawMedia)) {
      mediaUrls = rawMedia
        .filter((url): url is string => typeof url === "string")
        .map(url => url.trim())
        .filter(url => !!url && url.startsWith("http"));
    } else if (typeof rawMedia === "string" && rawMedia) {
      const clean = rawMedia.trim();
      if (clean.startsWith("[") && clean.endsWith("]")) {
        try {
          const parsedArr: unknown = JSON.parse(clean);
          if (Array.isArray(parsedArr)) {
            // SAFETY: assign filtered array with explicit type annotation
            const stringArr = parsedArr.filter((item): item is string => typeof item === "string") as string[];
            mediaUrls = stringArr
              .map(item => item.trim())
              .filter(item => !!item && item.startsWith("http"));
          }
        } catch (e) {
          console.warn("cannot JSON.parse media_urls!", e, clean);
        }
      } else if (clean.includes(",")) {
        mediaUrls = clean
          .split(",")
          .map((s) => s.trim().replace(/^"|"$/g, "")) // remove quotes
          .filter((s) => s.startsWith("http"));
      } else if (clean.startsWith("http") && clean.length > 8) {
        mediaUrls = [clean];
      }
    }
    // Fallback: sampleImageUrl
    if (
      (!mediaUrls || mediaUrls.length === 0) &&
      quote.sampleImageUrl &&
      typeof quote.sampleImageUrl === "string" &&
      quote.sampleImageUrl.startsWith("http")
    ) {
      mediaUrls = [quote.sampleImageUrl];
    }
    return mediaUrls;
  }, [quote.media_urls, quote.sampleImageUrl]);
}

