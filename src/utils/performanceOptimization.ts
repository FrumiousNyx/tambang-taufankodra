// Lightweight Performance Optimization
export const performanceOptimization = {
  // Simple cache for critical resources
  cache: new Set<string>(),
  
  // Preload critical resources
  preloadCriticalResources: function() {
    const criticalResources = [
      '/images/hero-bg.jpg',
      '/images/logo.svg'
    ];

    criticalResources.forEach(resource => {
      if (!performanceOptimization.cache.has(resource)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.jpg') ? 'image' : 'image';
        document.head.appendChild(link);
        performanceOptimization.cache.add(resource);
      }
    });
  },

  // Optimized image loading
  optimizeImages: () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    images.forEach(img => imageObserver.observe(img));
  },

  // Prevent layout shifts
  preventLayoutShift: () => {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    
    images.forEach(img => {
      const tempImg = new Image();
      tempImg.onload = () => {
        (img as HTMLImageElement).width = tempImg.width;
        (img as HTMLImageElement).height = tempImg.height;
        (img as HTMLImageElement).style.aspectRatio = `${tempImg.width}/${tempImg.height}`;
      };
      tempImg.src = (img as HTMLImageElement).src;
    });
  },

  // Optimize font loading
  optimizeFontLoading: () => {
    // Preconnect to Google Fonts
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);
    
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);
  },

  // Debounce utility
  debounce: (callback: Function, delay: number = 100) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback.apply(null, args), delay);
    };
  },

  // Throttle utility
  throttle: (callback: Function, limit: number = 100) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        callback.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Initialize optimizations
  init: function() {
    // Critical optimizations
    performanceOptimization.optimizeFontLoading();
    performanceOptimization.preventLayoutShift();
    
    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        performanceOptimization.optimizeImages();
        performanceOptimization.preloadCriticalResources();
      });
    } else {
      performanceOptimization.optimizeImages();
      performanceOptimization.preloadCriticalResources();
    }
  }
};

// Initialize if in browser
if (typeof window !== 'undefined') {
  performanceOptimization.init();
}
