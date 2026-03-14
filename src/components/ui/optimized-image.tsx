import React, { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean; // For critical images
  placeholder?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// WebP support detection
let webpSupported: boolean | null = null;
const checkWebPSupport = () => {
  if (webpSupported !== null) return webpSupported;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  return webpSupported;
};

// Intersection Observer untuk lazy loading
let imageObserver: IntersectionObserver | null = null;
const getImageObserver = () => {
  if (!imageObserver) {
    imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              delete img.dataset.src;
              imageObserver!.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }
  return imageObserver;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder,
  fallback,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized src
  const getOptimizedSrc = (originalSrc: string) => {
    if (!checkWebPSupport()) return originalSrc;
    
    // Try WebP version first
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpSrc;
  };

  // Generate responsive srcset
  const getSrcSet = (originalSrc: string) => {
    const extensions = ['webp', 'avif', 'jpg', 'png'];
    const srcSet: string[] = [];
    
    extensions.forEach(ext => {
      const baseSrc = originalSrc.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '');
      srcSet.push(`${baseSrc}.${ext} 1x`);
      if (width && width > 400) {
        srcSet.push(`${baseSrc}@2x.${ext} 2x`);
      }
    });
    
    return srcSet.join(', ');
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const optimizedSrc = getOptimizedSrc(src);
    
    if (priority) {
      // Load immediately for priority images
      setCurrentSrc(optimizedSrc);
    } else {
      // Lazy load for non-priority images
      img.dataset.src = optimizedSrc;
      getImageObserver().observe(img);
    }

    return () => {
      if (img && !priority && img.dataset.src) {
        getImageObserver().unobserve(img);
      }
    };
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    if (currentSrc.includes('.webp') && !currentSrc.includes('.jpg')) {
      // Fallback to original format if WebP fails
      const originalSrc = src.replace(/\.webp$/i, '.jpg');
      setCurrentSrc(originalSrc);
    } else if (fallback) {
      setCurrentSrc(fallback);
    } else {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      )}
      
      {placeholder && isLoading && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          aria-hidden="true"
        />
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } w-full h-full object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          contain: 'layout'
        }}
      />
    </div>
  );
};

// Preload critical images
export const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Batch preload multiple images
export const preloadImages = (srcs: string[]) => {
  srcs.forEach(src => preloadImage(src));
};
