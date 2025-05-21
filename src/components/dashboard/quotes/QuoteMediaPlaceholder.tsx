
import React from "react";

/**
 * Renders a simple placeholder UI for when there is no media.
 */
const QuoteMediaPlaceholder = () => (
  <div className="flex flex-col items-center justify-center w-full py-3 text-gray-400">
    <span className="material-icons text-5xl mb-2" aria-hidden="true">
      image_off
    </span>
    <span className="text-xs">אין מדיה זמינה לתצוגה</span>
  </div>
);

export default QuoteMediaPlaceholder;
