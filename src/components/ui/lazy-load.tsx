import React, { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyLoadProps {
  componentPath: string;
  fallback?: React.ReactNode;
  delay?: number;
}

// Cache untuk loaded components
const componentCache = new Map<string, ComponentType<any>>();

export const LazyLoad: React.FC<LazyLoadProps> = ({ 
  componentPath, 
  fallback = <DefaultFallback />,
  delay = 200 
}) => {
  // Check cache first
  if (componentCache.has(componentPath)) {
    const CachedComponent = componentCache.get(componentPath)!;
    return <CachedComponent />;
  }

  // Create lazy component dengan error boundary
  const LazyComponent = lazy(() => {
    return new Promise<{ default: ComponentType<any> }>((resolve) => {
      // Add delay untuk smooth loading
      setTimeout(() => {
        import(componentPath).then(module => {
          // Cache the component
          componentCache.set(componentPath, module.default);
          resolve(module);
        }).catch(error => {
          console.error(`Failed to load component: ${componentPath}`, error);
          // Resolve dengan error component
          resolve({ 
            default: () => <div className="p-4 text-red-500">Failed to load component</div> 
          });
        });
      }, delay);
    });
  });

  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
};

// Default fallback component
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
  </div>
);

// HOC untuk lazy loading components
export const withLazyLoad = <P extends object>(
  componentPath: string,
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <LazyLoad componentPath={componentPath} fallback={fallback}>
      {/* Props akan diteruskan ke component yang di-load */}
    </LazyLoad>
  );
};

// Preload function untuk critical components
export const preloadComponent = async (componentPath: string) => {
  if (!componentCache.has(componentPath)) {
    try {
      const module = await import(componentPath);
      componentCache.set(componentPath, module.default);
    } catch (error) {
      console.error(`Failed to preload component: ${componentPath}`, error);
    }
  }
};

// Clear cache utility
export const clearComponentCache = () => {
  componentCache.clear();
};
