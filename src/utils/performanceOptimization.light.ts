// @ts-nocheck
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
      if (!this.cache?.has(resource)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.jpg') ? 'image' : 'image';
        document.head.appendChild(link);
        this.cache?.add(resource);
      }
    });
  },

  // Simple lazy loading for images
  lazyLoadImages: function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  },

  // Initialize performance optimizations
  init: function() {
    // Run on DOM content loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.preloadCriticalResources();
        this.lazyLoadImages();
      });
    } else {
      this.preloadCriticalResources();
      this.lazyLoadImages();
    }
  }
};
