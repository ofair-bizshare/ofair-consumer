
import { useScrollToTop } from "@/hooks/useScrollToTop";

// This component doesn't render anything, it just uses the useScrollToTop hook
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export default ScrollToTop;
