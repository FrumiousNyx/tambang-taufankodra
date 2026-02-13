import React from 'react';

const ContactSkeleton: React.FC = () => {
  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          {/* Header Skeleton */}
          <div className="text-center mb-10">
            <div className="h-8 bg-slate-200 rounded-lg w-64 mx-auto mb-3 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-96 mx-auto animate-pulse" />
          </div>

          {/* Contact Info Skeleton */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-slate-200 rounded-lg mx-auto mb-3 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded w-24 mx-auto mb-2 animate-pulse" />
                <div className="h-3 bg-slate-50 rounded w-32 mx-auto animate-pulse" />
              </div>
            ))}
          </div>

          {/* Form Skeleton */}
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 bg-slate-100 rounded w-24 mb-2 animate-pulse" />
                  <div className="h-12 bg-slate-50 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
            
            <div>
              <div className="h-4 bg-slate-100 rounded w-32 mb-2 animate-pulse" />
              <div className="h-32 bg-slate-50 rounded-lg animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 bg-slate-100 rounded w-80 animate-pulse" />
            </div>

            <div className="h-12 bg-slate-200 rounded-lg w-48 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSkeleton;
