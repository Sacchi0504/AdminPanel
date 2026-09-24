'use client';

import React, { useEffect, useState } from 'react';
import { Category } from '@/types/product';
import { getCategories } from '@/api/categories';
import { Layers } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (isMounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative min-w-[180px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <Layers className="w-4 h-4" />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        disabled={isLoading}
        className="w-full pl-9 pr-8 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all appearance-none cursor-pointer disabled:opacity-50"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
        ▼
      </div>
    </div>
  );
}
