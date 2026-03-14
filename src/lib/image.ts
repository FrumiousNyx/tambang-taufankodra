// Small helper to generate srcset for images served from the same origin
export function generateSrcSet(src: string, widths = [320,480,768,1024,1366,1600,1920]) {
  try {
    const url = new URL(src, typeof window !== 'undefined' ? window.location.origin : '');
    // If src already has query params, preserve them
    return widths.map(w => {
      const u = new URL(url.toString());
      if (!u.search) u.search = '';
      // Common CDN parameters - safe when CDN ignores unknown params
      u.searchParams.set('w', String(w));
      u.searchParams.set('auto', 'format');
      return `${u.toString()} ${w}w`;
    }).join(', ');
  } catch (e) {
    return '';
  }
}

export function defaultSizes() {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}
