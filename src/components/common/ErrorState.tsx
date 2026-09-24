import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load the products right now. Please check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="w-full bg-rose-950/20 border border-rose-900/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center my-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-900/40 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-rose-200 tracking-tight">{title}</h3>
      <p className="text-sm text-rose-300/80 max-w-md mt-1 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-900/40"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
