import React from 'react';
import { Skeleton } from './skeleton';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="grid grid-cols-5 min-h-[320px]">
        <div className="col-span-2 bg-slate-100 p-6 relative overflow-hidden">
          <Skeleton className="w-16 h-16 bg-slate-200 rounded-full absolute top-2 left-2" />
          <Skeleton className="w-24 h-24 bg-slate-200 rounded-full absolute bottom-2 right-2" />
          <div className="flex items-center justify-center h-full">
            <Skeleton className="w-32 h-32 bg-slate-200 rounded" />
          </div>
        </div>
        
        <div className="col-span-3 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <Skeleton className="h-8 w-32 bg-slate-200 rounded" />
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="w-3 h-3 bg-slate-200 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-8 bg-slate-200 rounded mt-1" />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full bg-slate-200 rounded" />
              <Skeleton className="h-4 w-3/4 bg-slate-200 rounded" />
              <Skeleton className="h-4 w-1/2 bg-slate-200 rounded" />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-6 w-24 bg-slate-200 rounded-full" />
              <Skeleton className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="text-left">
                <Skeleton className="h-3 w-16 bg-slate-200 rounded mb-1" />
                <Skeleton className="h-4 w-20 bg-slate-200 rounded" />
              </div>
            </div>
            <Skeleton className="h-4 w-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
