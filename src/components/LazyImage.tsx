import React, { useState, useRef, useEffect } from 'react';
import { generateSrcSet, defaultSizes } from '@/lib/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = '/placeholder.jpg',
  onLoad,
  onError,
  sizes
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        loading="eager"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          decoding="async"
          srcSet={generateSrcSet(src)}
          sizes={sizes || defaultSizes()}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
      
      {/* Loading State */}
      {!isLoaded && isInView && !hasError && (
        <div className="absolute inset-0 bg-slate-100 animate-pulse">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-accent rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-xs text-slate-500">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
