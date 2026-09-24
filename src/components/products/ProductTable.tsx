'use client';

import React from 'react';
import { Product, SortField, SortOrder } from '@/types/product';
import ProductRow from './ProductRow';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  currentSort: SortField;
  currentOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  onDeleteClick: (product: Product) => void;
}

export default function ProductTable({
  products,
  currentSort,
  currentOrder,
  onSortChange,
  onDeleteClick,
}: ProductTableProps) {
  const handleSortHeader = (field: SortField) => {
    if (currentSort === field) {
      // Toggle order
      onSortChange(field, currentOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort field default to asc (or desc for rating)
      onSortChange(field, field === 'rating' ? 'desc' : 'asc');
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (currentSort !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:opacity-100" />;
    }
    return currentOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-teal-400 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-teal-400 font-bold" />
    );
  };

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {/* Product Title Header with Sort */}
              <th className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => handleSortHeader('title')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors group font-bold"
                >
                  <span>Product</span>
                  {renderSortIndicator('title')}
                </button>
              </th>

              {/* Category */}
              <th className="py-3.5 px-4 hidden md:table-cell">Category</th>

              {/* Price with Sort */}
              <th className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => handleSortHeader('price')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors group font-bold"
                >
                  <span>Price</span>
                  {renderSortIndicator('price')}
                </button>
              </th>

              {/* Rating with Sort */}
              <th className="py-3.5 px-4 hidden lg:table-cell">
                <button
                  type="button"
                  onClick={() => handleSortHeader('rating')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors group font-bold"
                >
                  <span>Rating</span>
                  {renderSortIndicator('rating')}
                </button>
              </th>

              {/* Stock */}
              <th className="py-3.5 px-4 hidden sm:table-cell">Stock</th>

              {/* Actions */}
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
