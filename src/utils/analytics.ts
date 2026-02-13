// Advanced Analytics Tracking
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: any) => void;
    dataLayer?: any[];
  }
}

const GA_ID = (import.meta.env.VITE_GA_ID as string) || 'G-XXXXXXXXXX';

/**
 * Initialize Google Analytics (gtag) if a GA id is provided via env.
 * Call `analytics.init()` once on client boot (e.g. in root App component).
 */
export const analytics = {
  init: () => {
    if (typeof window === 'undefined' || !GA_ID) return;

    // Avoid injecting multiple times
    if (document.querySelector(`script[data-gtag="${GA_ID}"]`)) return;

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    (window as any).gtag = gtag;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.setAttribute('data-gtag', GA_ID);
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  },

  pageView: (path: string, title: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_ID, { page_path: path, page_title: title });
    }
  },

  trackEvent: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, { event_category: category, event_label: label, value });
    }
  },

  trackFormSubmission: (formName: string, success: boolean) => {
    analytics.trackEvent('form_submit', 'contact', formName, success ? 1 : 0);
  },

  trackLanguageChange: (language: string) => {
    analytics.trackEvent('language_change', 'user_preference', language);
  },

  trackProductView: (productName: string, category: string) => {
    analytics.trackEvent('product_view', 'engagement', productName);
  },

  trackScrollDepth: (depth: number) => {
    analytics.trackEvent('scroll_depth', 'engagement', `${depth}%`);
  },

  trackPerformance: (metric: string, value: number) => {
    analytics.trackEvent('performance', 'technical', metric, value);
  },

  trackError: (error: Error, context: string) => {
    analytics.trackEvent('error', 'technical', context);
  }
};

export const performanceMonitor = {
  init: () => {
    if (typeof window === 'undefined') return;
    if ('PerformanceObserver' in window) {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) analytics.trackPerformance('LCP', Math.round((lastEntry as any).startTime));
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          analytics.trackPerformance('FID', Math.round(entry.processingStart - entry.startTime));
        });
      }).observe({ entryTypes: ['first-input'] });

      new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) clsValue += entry.value;
        });
        analytics.trackPerformance('CLS', Math.round(clsValue * 1000) / 1000);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
};
