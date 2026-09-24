'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { Eye, Edit3, Trash2, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDeleteClick: (product: Product) => void;
}

export default function ProductCard({ product, onDeleteClick }: ProductCardProps) {
  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
          Out of Stock
        </span>
      );
    }
    if (stock <= 10) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Low: {stock}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        Stock: {stock}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
      <div>
        {/* Product Image & Badges */}
        <div className="relative w-full h-44 bg-slate-950/60 rounded-xl overflow-hidden mb-3 border border-slate-800/80 flex items-center justify-center p-2">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="text-slate-600 text-xs">No image available</div>
          )}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-900/90 text-slate-300 border border-slate-700 uppercase tracking-wider backdrop-blur-sm">
              {product.category}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            {getStockBadge(product.stock)}
          </div>
        </div>

        {/* Title & Brand */}
        <div className="text-xs text-teal-400 font-medium">{product.brand || 'General'}</div>
        <Link
          href={`/products/${product.id}`}
          className="text-base font-bold text-white hover:text-teal-400 transition-colors line-clamp-1 mt-0.5"
        >
          {product.title}
        </Link>
        <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
          {product.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
            {product.discountPercentage && product.discountPercentage > 0 ? (
              <span className="ml-2 text-xs font-medium text-teal-400">
                {product.discountPercentage.toFixed(0)}% OFF
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span>View</span>
          </Link>
          <Link
            href={`/products/${product.id}/edit`}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit</span>
          </Link>
          <button
            type="button"
            onClick={() => onDeleteClick(product)}
            className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-medium border border-rose-500/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
