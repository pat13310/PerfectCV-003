import React from 'react';

interface DashboardSkeletonProps {
  type: 'cvs' | 'letters' | 'profile' |'subscription' | 'settings';
}

export function DashboardSkeleton({ type }: DashboardSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'cvs':
        return (
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-16 bg-gray-200 rounded-full" />
                      <div className="h-6 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'letters':
        return (
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div>
                        <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                        <div className="h-3 w-32 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="animate-pulse max-w-3xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-in fade-in slide-in-from-bottom duration-300">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 w-full bg-gray-200 rounded animate-in fade-in slide-in-from-bottom duration-300" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="animate-pulse max-w-3xl mx-auto">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-in fade-in slide-in-from-bottom duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-48 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-10 w-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return renderSkeleton();
}