
/**
 * Utility hook that converts any value of media_urls (array, comma-separated string, JSON string, etc.)
 * into a string array for easier display anywhere in the app.
 *
 * Usage: const mediaUrls = useMediaUrls(quote.media_urls, quote.sampleImageUrl)
 */
export function useMediaUrls(
  media_urls: string[] | string | null | undefined,
  sampleImageUrl?: string | null
): string[] {
  let output: string[] = [];

  if (Array.isArray(media_urls)) {
    // לוג חדש לבדוק בהירות
    console.log("[useMediaUrls] Detected Array input:", media_urls);

    // Filter only valid string URLs
    output = media_urls.filter((url): url is string =>
      typeof url === "string" &&
      !!url &&
      url.startsWith("http")
    );
  } else if (typeof media_urls === "string" && media_urls.trim() !== "") {
    const clean = media_urls.trim();

    console.log("[useMediaUrls] Raw string:", clean);

    if (clean.startsWith("[") && clean.endsWith("]")) {
      // JSON array string
      try {
        const arr = JSON.parse(clean);
        if (Array.isArray(arr)) {
          output = arr
            .filter((x): x is string => typeof x === "string" && !!x && x.startsWith("http"))
            .map((x) => x.trim());
        }
      } catch (e) {
        // fallback, ignore
        console.warn("[useMediaUrls] Failed to parse JSON:", clean, e);
      }
    } else if (clean.includes(",")) {
      // comma separated string
      output = clean
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter((s) => s.startsWith("http"));
    } else if (clean.startsWith("http") && clean.length > 8) {
      // single URL
      output = [clean];
    }
  }

  // Fallback for sampleImageUrl if nothing fetched so far
  if ((!output || output.length === 0) && sampleImageUrl && typeof sampleImageUrl === "string" && sampleImageUrl.startsWith("http")) {
    output = [sampleImageUrl];
  }

  // לוג למעקב תוצאה סופית
  console.log("[useMediaUrls] Final output:", output);

  return output;
}
