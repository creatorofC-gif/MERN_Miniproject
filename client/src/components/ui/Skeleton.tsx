import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-20 h-4" />
      </div>
      <Skeleton className="w-3/4 h-6" />
      <Skeleton className="w-full h-12" />
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <Skeleton className="w-24 h-6 rounded-full" />
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
    </div>
  );
};
