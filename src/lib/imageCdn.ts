// Image CDN wrapper - handles image optimization and responsive serving
// Supports local images and third-party CDNs (Cloudinary, Vercel Image Optimization, etc.)

export type ImageOptimizationStrategy = 'local' | 'cloudinary' | 'vercel' | 'imgix';

interface ImageConfig {
  baseUrl: string;
  cdnStrategy: ImageOptimizationStrategy;
}

const config: ImageConfig = {
  baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
  cdnStrategy: (import.meta.env.VITE_IMAGE_CDN as ImageOptimizationStrategy) || 'local',
};

/**
 * Generate optimized image URL with width parameter
 * Supports multiple CDN strategies
 */
export function getOptimizedImageUrl(
  imagePath: string,
  width?: number,
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  if (!imagePath) return '';

  const u = new URL(imagePath, config.baseUrl);

  switch (config.cdnStrategy) {
    case 'cloudinary':
      // Cloudinary transformation syntax
      // https://res.cloudinary.com/account/image/upload/w_800,f_auto,q_auto/path/to/image.jpg
      if (u.hostname !== 'res.cloudinary.com') {
        console.warn('Cloudinary URL format expected');
      }
      const pathParts = u.pathname.split('/upload/');
      if (pathParts.length === 2) {
        const transform = [`f_${format}`, 'q_auto'];
        if (width) transform.unshift(`w_${width}`);
        return `${pathParts[0]}/upload/${transform.join(',')}/{{pathParts[1]}}`;
      }
      return imagePath;

    case 'vercel':
      // Vercel Image Optimization: /_next/image?url=...&w=800&q=75
      // Not directly exposed in Vite, but can proxy through API
      return imagePath;

    case 'imgix':
      // imgix format: https://domain.imgix.net/path?w=800&format=webp&auto=format
      u.searchParams.set('auto', 'format');
      if (width) u.searchParams.set('w', String(width));
      u.searchParams.set('format', format);
      return u.toString();

    case 'local':
    default:
      // Local: append query params for CDN if proxied through reverse proxy/edge function
      // e.g., /_images?src=/path&w=800
      if (width) {
        u.searchParams.set('w', String(width));
        u.searchParams.set('auto', 'format');
      }
      return u.toString();
  }
}

/**
 * Generate responsive image srcset
 * Responsive widths for common breakpoints
 */
export function getImageSrcSet(
  imagePath: string,
  widths: number[] = [320, 480, 768, 1024, 1366, 1600, 1920],
  format?: 'webp' | 'jpg' | 'png'
): string {
  return widths
    .map(
      (w) =>
        `${getOptimizedImageUrl(imagePath, w, format)} ${w}w`
    )
    .join(', ');
}

/**
 * Common sizes attribute for responsive images
 */
export function getImageSizes(
  context: 'hero' | 'thumbnail' | 'product' | 'full' = 'full'
): string {
  const sizes: Record<string, string> = {
    hero: '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 1200px',
    thumbnail: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px',
    product: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
    full: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  };
  return sizes[context] || sizes.full;
}

/**
 * Preload image for better LCP
 * Useful for hero images, OG images
 */
export function preloadImage(
  imagePath: string,
  context: 'hero' | 'og' = 'og'
): void {
  if (typeof window === 'undefined' || !document) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';

  if (context === 'hero') {
    link.href = getOptimizedImageUrl(imagePath, 1200);
    link.imagesrcset = getImageSrcSet(imagePath, [640, 1024, 1440]);
    link.imagesizes = getImageSizes('hero');
  } else {
    // og image - just preload the main URL
    link.href = imagePath;
  }

  document.head.appendChild(link);
}

/**
 * Generate <picture> element for modern image support
 */
export function getPictureHTML(
  imagePath: string,
  alt: string,
  context: 'hero' | 'product' = 'product'
): string {
  const webpSrcset = getImageSrcSet(imagePath, undefined, 'webp');
  const jpgSrcset = getImageSrcSet(imagePath, undefined, 'jpg');
  const sizes = getImageSizes(context);
  const fallbackUrl = getOptimizedImageUrl(imagePath, undefined, 'jpg');

  return `
    <picture>
      <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}" />
      <source type="image/jpeg" srcset="${jpgSrcset}" sizes="${sizes}" />
      <img src="${fallbackUrl}" alt="${alt}" sizes="${sizes}" loading="lazy" decoding="async" />
    </picture>
  `;
}
