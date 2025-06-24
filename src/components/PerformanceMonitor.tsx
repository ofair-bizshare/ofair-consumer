
import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Report Web Vitals for monitoring
    const reportWebVitals = (metric: any) => {
      console.log('Web Vital:', metric.name, metric.value);
      
      // Send to analytics if needed
      if (typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    };

    // Measure Core Web Vitals
    if (typeof window !== 'undefined' && 'web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(reportWebVitals);
        getFID(reportWebVitals);
        getFCP(reportWebVitals);
        getLCP(reportWebVitals);
        getTTFB(reportWebVitals);
      }).catch(() => {
        // Graceful fallback if web-vitals fails to load
        console.log('Web Vitals library not available');
      });
    }

    // Preload critical routes
    const preloadRoutes = () => {
      const routes = ['/search', '/dashboard', '/login'];
      routes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Preload after initial load
    setTimeout(preloadRoutes, 2000);

    // Cleanup function
    return () => {
      // Remove prefetch links if needed
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      prefetchLinks.forEach(link => link.remove());
    };
  }, []);

  return null;
};

export default PerformanceMonitor;
