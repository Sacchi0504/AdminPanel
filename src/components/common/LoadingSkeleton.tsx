import React from 'react';

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
      {/* Table Header Skeleton */}
      <div className="h-12 bg-slate-800/80 border-b border-slate-800 flex items-center px-6 gap-4">
        <div className="w-12 h-4 bg-slate-700/60 rounded"></div>
        <div className="w-48 h-4 bg-slate-700/60 rounded"></div>
        <div className="w-24 h-4 bg-slate-700/60 rounded hidden md:block"></div>
        <div className="w-20 h-4 bg-slate-700/60 rounded"></div>
        <div className="w-20 h-4 bg-slate-700/60 rounded hidden lg:block"></div>
        <div className="w-20 h-4 bg-slate-700/60 rounded hidden sm:block"></div>
        <div className="w-24 h-4 bg-slate-700/60 rounded ml-auto"></div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-slate-800/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 flex items-center px-6 gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded-xl shrink-0"></div>
            <div className="space-y-2 flex-1 max-w-xs">
              <div className="w-3/4 h-3.5 bg-slate-800 rounded"></div>
              <div className="w-1/2 h-2.5 bg-slate-800/60 rounded"></div>
            </div>
            <div className="w-24 h-6 bg-slate-800/70 rounded-full hidden md:block"></div>
            <div className="w-16 h-4 bg-slate-800 rounded"></div>
            <div className="w-16 h-4 bg-slate-800 rounded hidden lg:block"></div>
            <div className="w-16 h-4 bg-slate-800 rounded hidden sm:block"></div>
            <div className="flex gap-2 ml-auto">
              <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
              <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3"
        >
          <div className="w-full h-44 bg-slate-800 rounded-xl"></div>
          <div className="w-1/3 h-4 bg-slate-800 rounded"></div>
          <div className="w-3/4 h-5 bg-slate-800 rounded"></div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
            <div className="w-16 h-5 bg-slate-800 rounded"></div>
            <div className="w-20 h-4 bg-slate-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
