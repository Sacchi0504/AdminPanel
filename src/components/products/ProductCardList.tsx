'use client';

import React from 'react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductCardListProps {
  products: Product[];
  catalogQueryString?: string;
  onDeleteClick: (product: Product) => void;
}

export default function ProductCardList({ products, catalogQueryString = '', onDeleteClick }: ProductCardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          catalogQueryString={catalogQueryString}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
}
