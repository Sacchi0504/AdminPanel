'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortField, SortOrder } from '@/types/product';

interface SortControlProps {
  currentSort: SortField;
  currentOrder: SortOrder;
  onSortChange: (sort: SortField, order: SortOrder) => void;
}

export default function SortControl({
  currentSort,
  currentOrder,
  onSortChange,
}: SortControlProps) {
  // Composite sort value for dropdown: e.g. "price-asc"
  const compositeValue = currentSort ? `${currentSort}-${currentOrder}` : '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      onSortChange('', 'asc');
      return;
    }

    const [field, order] = val.split('-') as [SortField, SortOrder];
    onSortChange(field, order);
  };

  return (
    <div className="relative min-w-[170px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <ArrowUpDown className="w-4 h-4" />
      </div>
      <select
        value={compositeValue}
        onChange={handleChange}
        className="w-full pl-9 pr-8 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer"
        aria-label="Sort products"
      >
        <option value="">Default Sorting</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Rating: Highest First</option>
        <option value="rating-asc">Rating: Lowest First</option>
        <option value="title-asc">Title: A to Z</option>
        <option value="title-desc">Title: Z to A</option>
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
        ▼
      </div>
    </div>
  );
}
