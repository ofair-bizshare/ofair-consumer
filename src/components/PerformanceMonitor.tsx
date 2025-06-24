
import { useEffect } from 'react';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const PerformanceMonitor = () => {
  useEffect(() => {
    // Enhanced Web Vitals reporting
    const reportWebVitals = (metric: any) => {
      console.log(`Web Vital: ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
        navigationType: metric.navigationType || 'unknown'
      });
      
      // Send to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          custom_parameter_1: metric.rating,
          non_interaction: true,
        });
      }
    };

    // Measure Core Web Vitals with error handling
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
        try {
          onCLS(reportWebVitals);
          onFCP(reportWebVitals);
          onLCP(reportWebVitals);
          onTTFB(reportWebVitals);
          onINP(reportWebVitals);
          
          console.log('✅ Web Vitals monitoring initialized successfully');
        } catch (error) {
          console.warn('❌ Error initializing Web Vitals:', error);
        }
      }).catch((error) => {
        console.warn('❌ Web Vitals library failed to load:', error);
      });
    }

    // Enhanced preloading strategy
    const preloadCriticalRoutes = () => {
      const routes = [
        { href: '/search', priority: 'high' },
        { href: '/dashboard', priority: 'medium' },
        { href: '/login', priority: 'low' }
      ];
      
      routes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route.href;
        link.setAttribute('fetchpriority', route.priority);
        document.head.appendChild(link);
      });
      
      console.log('🚀 Critical routes preloaded');
    };

    // Monitor performance metrics
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
            TCP: navigation.connectEnd - navigation.connectStart,
            Request: navigation.responseStart - navigation.requestStart,
            Response: navigation.responseEnd - navigation.responseStart,
            DOM: navigation.domContentLoadedEventEnd - navigation.responseEnd,
            Load: navigation.loadEventEnd - navigation.loadEventStart
          };
          
          console.log('📊 Performance Timing:', metrics);
        }
      }
    };

    // Memory usage monitoring (if available)
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('🧠 Memory Usage:', {
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }
    };

    // Execute optimizations after initial load
    const timeouts: NodeJS.Timeout[] = [];
    
    timeouts.push(setTimeout(preloadCriticalRoutes, 1000));
    timeouts.push(setTimeout(measurePerformance, 2000));
    timeouts.push(setTimeout(monitorMemory, 3000));

    // Cleanup function
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      
      // Remove prefetch links
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      prefetchLinks.forEach(link => link.remove());
    };
  }, []);

  return null;
};

export default PerformanceMonitor;
