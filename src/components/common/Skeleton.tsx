import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = true 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${width} ${height} ${rounded ? 'rounded' : ''} ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow border animate-pulse">
    <div className="space-y-4">
      <Skeleton height="h-6" width="w-3/4" />
      <Skeleton height="h-4" width="w-full" />
      <Skeleton height="h-4" width="w-2/3" />
      <div className="flex space-x-2">
        <Skeleton height="h-8" width="w-20" />
        <Skeleton height="h-8" width="w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonContentList: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow border animate-pulse">
          <Skeleton height="h-4" width="w-1/2" />
          <Skeleton height="h-8" width="w-1/3" className="mt-2" />
        </div>
      ))}
    </div>
    
    {/* Content List */}
    <div className="bg-white rounded-lg shadow border p-6">
      <Skeleton height="h-6" width="w-1/4" className="mb-4" />
      <SkeletonContentList />
    </div>
  </div>
); 