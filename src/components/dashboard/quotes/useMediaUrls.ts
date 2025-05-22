
import { useMemo } from "react";
import { QuoteInterface } from "@/types/dashboard";

/**
 * Returns an array of valid media URLs from a quote, handling strings, arrays, or JSON.
 */
export function useMediaUrls(quote: QuoteInterface): string[] {
  // Helper: Filter any array to only strings
  const toStringArray = (arr: unknown): string[] =>
    Array.isArray(arr) ? arr.filter((val): val is string => typeof val === "string") : [];

  return useMemo(() => {
    let mediaUrls: string[] = [];
    const rawMedia = quote.media_urls;

    if (Array.isArray(rawMedia)) {
      mediaUrls = toStringArray(rawMedia)
        .map(url => url.trim())
        .filter(url => !!url && url.startsWith("http"));
    } else if (typeof rawMedia === "string" && rawMedia) {
      const clean = rawMedia.trim();
      if (clean.startsWith("[") && clean.endsWith("]")) {
        try {
          const parsedArr: unknown = JSON.parse(clean);
          // Always filter as string array before using .trim()
          const arr = toStringArray(parsedArr);
          // Fix: force array type so TypeScript knows `item` is string
          mediaUrls = (arr as string[]).map(item => item.trim()).filter(item => !!item && item.startsWith("http"));
        } catch (e) {
          console.warn("cannot JSON.parse media_urls!", e, clean);
        }
      } else if (clean.includes(",")) {
        // Might be a comma-separated string of URLs
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

