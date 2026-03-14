import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from './skeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  // Generate WebP and fallback sources
  const generateSources = () => {
    const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '');
    const originalExt = src.match(/\.(jpg|jpeg|png)$/i)?.[1] || 'jpg';

    return (
      <>
        <source
          srcSet={`${baseSrc}.webp`}
          type="image/webp"
        />
        <source
          srcSet={src}
          type={`image/${originalExt === 'jpg' ? 'jpeg' : originalExt}`}
        />
      </>
    );
  };

  const imageStyle = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
        style={imageStyle}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={imageStyle}
    >
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {isInView && (
        <picture>
          {generateSources()}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } w-full h-full object-cover`}
            style={imageStyle}
          />
        </picture>
      )}
    </div>
  );
};

export default OptimizedImage;
