
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

  console.log("[useMediaUrls] Input media_urls:", media_urls, "sampleImageUrl:", sampleImageUrl);

  if (Array.isArray(media_urls)) {
    // Filter only valid string URLs
    output = media_urls.filter((url): url is string =>
      typeof url === "string" &&
      !!url &&
      url !== "null" &&
      url !== "undefined" &&
      url.trim() !== "" &&
      (url.startsWith("http") || url.startsWith("data:"))
    );
    console.log("[useMediaUrls] Processed array:", output);
  } else if (typeof media_urls === "string" && media_urls.trim() !== "") {
    const clean = media_urls.trim();

    if (clean === "null" || clean === "undefined") {
      output = [];
    } else if (clean.startsWith("[") && clean.endsWith("]")) {
      // JSON array string
      try {
        const arr = JSON.parse(clean);
        if (Array.isArray(arr)) {
          output = arr
            .filter((x): x is string => 
              typeof x === "string" && 
              !!x && 
              x !== "null" && 
              x !== "undefined" &&
              x.trim() !== "" &&
              (x.startsWith("http") || x.startsWith("data:"))
            )
            .map((x) => x.trim());
        }
        console.log("[useMediaUrls] Parsed JSON array:", output);
      } catch (e) {
        console.warn("[useMediaUrls] Failed to parse JSON:", clean, e);
      }
    } else if (clean.includes(",")) {
      // comma separated string
      output = clean
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter((s) => 
          s && 
          s !== "null" && 
          s !== "undefined" &&
          s.trim() !== "" &&
          (s.startsWith("http") || s.startsWith("data:"))
        );
      console.log("[useMediaUrls] Processed comma-separated:", output);
    } else if ((clean.startsWith("http") || clean.startsWith("data:")) && clean.length > 8) {
      // single URL
      output = [clean];
      console.log("[useMediaUrls] Single URL:", output);
    }
  }

  // Fallback for sampleImageUrl if nothing fetched so far
  if ((!output || output.length === 0) && 
      sampleImageUrl && 
      typeof sampleImageUrl === "string" && 
      sampleImageUrl !== "null" && 
      sampleImageUrl !== "undefined" &&
      sampleImageUrl.trim() !== "" &&
      (sampleImageUrl.startsWith("http") || sampleImageUrl.startsWith("data:"))) {
    output = [sampleImageUrl];
    console.log("[useMediaUrls] Using fallback sampleImageUrl:", output);
  }

  console.log("[useMediaUrls] Final output:", output);
  return output;
}
