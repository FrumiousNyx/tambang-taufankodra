import React from 'react';

interface PageSkeletonProps {
  type?: 'default' | 'card' | 'list';
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({ type = 'default' }) => {
  if (type === 'card') {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-6">
              <div className="h-4 bg-muted rounded mb-4 w-3/4"></div>
              <div className="h-3 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-4 w-5/6"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded mb-4 w-1/2"></div>
      <div className="h-4 bg-muted rounded mb-8 w-3/4"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6">
            <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6">
            <div className="h-4 bg-muted rounded mb-4"></div>
            <div className="h-3 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded w-5/6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageSkeleton;
