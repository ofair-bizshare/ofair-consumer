
/**
 * Utility hook that converts any value of media_urls (array, comma-separated string, JSON string, etc.)
 * into a string array for easier display anywhere in the app.
 *
 * This version is more permissive to handle various URL formats from the database.
 *
 * Usage: const mediaUrls = useMediaUrls(quote.media_urls, quote.sampleImageUrl)
 */
export function useMediaUrls(
  media_urls: string[] | string | null | undefined,
  sampleImageUrl?: string | null
): string[] {
  let output: string[] = [];

  console.log("[useMediaUrls] Input:", { media_urls, sampleImageUrl });

  const permissiveFilter = (item: unknown): item is string => {
    const s = String(item || '').trim();
    return s.length > 0 && s !== 'null' && s !== 'undefined';
  };

  if (Array.isArray(media_urls)) {
    output = media_urls.filter(permissiveFilter);
  } else if (typeof media_urls === 'string') {
    const clean = media_urls.trim();
    if (permissiveFilter(clean)) {
      if (clean.startsWith('[') && clean.endsWith(']')) {
        // Handle JSON array string
        try {
          const arr = JSON.parse(clean);
          if (Array.isArray(arr)) {
            output = arr.map(x => String(x || '').trim()).filter(permissiveFilter);
          }
        } catch (e) {
          console.warn('[useMediaUrls] Failed to parse JSON, treating as single string:', clean, e);
          // If JSON parsing fails, it might be a single string with brackets
          output = [clean];
        }
      } else if (clean.includes(',')) {
        // Handle comma-separated string
        output = clean
          .split(',')
          .map(s => s.trim().replace(/^"|"$/g, ''))
          .filter(permissiveFilter);
      } else {
        // Handle single URL string
        output = [clean];
      }
    }
  }

  // Fallback for sampleImageUrl if no other media was found
  if (output.length === 0 && permissiveFilter(sampleImageUrl)) {
    output = [sampleImageUrl!];
    console.log("[useMediaUrls] Using fallback sampleImageUrl.");
  }

  // Deduplicate the final array
  const finalOutput = [...new Set(output)];
  console.log("[useMediaUrls] Final output:", finalOutput);
  
  return finalOutput;
}
