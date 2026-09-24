'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Eye, Edit3, Trash2, Star } from 'lucide-react';
import { formatINR } from '@/utils/currency';

interface ProductRowProps {
  product: Product;
  catalogQueryString?: string;
  onDeleteClick: (product: Product) => void;
}

export default function ProductRow({ product, catalogQueryString = '', onDeleteClick }: ProductRowProps) {
  // Stock status badge configuration
  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Out of Stock
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Low: {stock}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {stock} in stock
      </span>
    );
  };

  return (
    <tr className="border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors group">
      {/* Product Image & Title */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="text-slate-600 text-[10px]">No img</div>
            )}
          </div>
          <div className="min-w-0 max-w-xs">
            <Link
              href={`/products/${product.id}${catalogQueryString}`}
              className="text-sm font-semibold text-slate-100 hover:text-teal-400 transition-colors line-clamp-1"
              title={product.title}
            >
              {product.title}
            </Link>
            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <span>{product.brand || 'Unbranded'}</span>
              {product.sku && (
                <>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-500 font-mono text-[11px]">{product.sku}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3 px-4 hidden md:table-cell">
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60 capitalize">
          {product.category}
        </span>
      </td>

      {/* Price in INR */}
      <td className="py-3 px-4 font-semibold text-sm text-slate-100">
        {formatINR(product.price)}
        {product.discountPercentage && product.discountPercentage > 0 ? (
          <span className="block text-[11px] font-normal text-teal-400">
            {product.discountPercentage.toFixed(0)}% off
          </span>
        ) : null}
      </td>

      {/* Rating */}
      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-200">{product.rating?.toFixed(1) || '0.0'}</span>
          {product.reviews && product.reviews.length > 0 && (
            <span className="text-[11px] text-slate-500">({product.reviews.length})</span>
          )}
        </div>
      </td>

      {/* Stock */}
      <td className="py-3 px-4 hidden sm:table-cell">
        {getStockBadge(product.stock)}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/products/${product.id}${catalogQueryString}`}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-colors"
            aria-label={`View details for ${product.title}`}
          >
            <Eye className="w-4 h-4" />
          </Link>
          <Link
            href={`/products/${product.id}/edit${catalogQueryString}`}
            title="Edit Product"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
            aria-label={`Edit ${product.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => onDeleteClick(product)}
            title="Delete Product"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            aria-label={`Delete ${product.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
