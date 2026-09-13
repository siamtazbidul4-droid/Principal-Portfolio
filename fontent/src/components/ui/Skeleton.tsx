import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#161616] rounded-sm border border-[#202020] ${className}`}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="p-6 bg-[#0D0D0D] border border-[#242424] rounded-sm flex flex-col gap-4">
      <Skeleton className="h-64 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}
