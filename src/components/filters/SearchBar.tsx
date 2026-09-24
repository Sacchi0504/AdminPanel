'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  initialValue?: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({
  initialValue = '',
  onSearchChange,
  isLoading = false,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedValue = useDebounce(inputValue, 400);

  // Sync internal state when external initialValue changes (e.g. Reset or URL change)
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Emit search change only when debounced value updates
  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="relative flex-1 min-w-[240px]">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search products by title or keywords..."
        className="w-full pl-10 pr-9 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all shadow-sm"
      />

      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
