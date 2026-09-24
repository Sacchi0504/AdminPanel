'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product } from '@/types/product';

interface ProductsContextType {
  createdProducts: Product[];
  updatedProducts: Record<number, Partial<Product>>;
  deletedIds: number[];
  addLocalProduct: (product: Product) => void;
  updateLocalProduct: (id: number, data: Partial<Product>) => void;
  deleteLocalProduct: (id: number) => void;
  isDeleted: (id: number) => boolean;
  applyLocalMutations: (products: Product[]) => Product[];
  applySingleProductMutation: (product: Product) => Product | null;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY_CREATED = 'admin_local_created_products';
const STORAGE_KEY_UPDATED = 'admin_local_updated_products';
const STORAGE_KEY_DELETED = 'admin_local_deleted_ids';

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [createdProducts, setCreatedProducts] = useState<Product[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<Record<number, Partial<Product>>>({});
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  // Hydrate from sessionStorage
  useEffect(() => {
    try {
      const storedCreated = sessionStorage.getItem(STORAGE_KEY_CREATED);
      const storedUpdated = sessionStorage.getItem(STORAGE_KEY_UPDATED);
      const storedDeleted = sessionStorage.getItem(STORAGE_KEY_DELETED);

      if (storedCreated) setCreatedProducts(JSON.parse(storedCreated));
      if (storedUpdated) setUpdatedProducts(JSON.parse(storedUpdated));
      if (storedDeleted) setDeletedIds(JSON.parse(storedDeleted));
    } catch (e) {
      console.warn('Could not read local simulated mutations:', e);
    }
  }, []);

  const addLocalProduct = useCallback((product: Product) => {
    setCreatedProducts((prev) => {
      const next = [product, ...prev.filter((p) => p.id !== product.id)];
      try {
        sessionStorage.setItem(STORAGE_KEY_CREATED, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const updateLocalProduct = useCallback((id: number, data: Partial<Product>) => {
    setUpdatedProducts((prev) => {
      const existing = prev[id] || {};
      const next = { ...prev, [id]: { ...existing, ...data } };
      try {
        sessionStorage.setItem(STORAGE_KEY_UPDATED, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Also update in createdProducts if present
    setCreatedProducts((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      try {
        sessionStorage.setItem(STORAGE_KEY_CREATED, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteLocalProduct = useCallback((id: number) => {
    setDeletedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        sessionStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(next));
      } catch {}
      return next;
    });

    // Also remove from createdProducts
    setCreatedProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        sessionStorage.setItem(STORAGE_KEY_CREATED, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isDeleted = useCallback((id: number): boolean => {
    return deletedIds.includes(id);
  }, [deletedIds]);

  const applySingleProductMutation = useCallback(
    (product: Product): Product | null => {
      if (deletedIds.includes(product.id)) {
        return null;
      }
      const updates = updatedProducts[product.id];
      if (updates) {
        return { ...product, ...updates };
      }
      return product;
    },
    [deletedIds, updatedProducts]
  );

  const applyLocalMutations = useCallback(
    (products: Product[]): Product[] => {
      const deletedSet = new Set(deletedIds);
      return products
        .filter((p) => !deletedSet.has(p.id))
        .map((p) => {
          const updates = updatedProducts[p.id];
          return updates ? { ...p, ...updates } : p;
        });
    },
    [deletedIds, updatedProducts]
  );

  return (
    <ProductsContext.Provider
      value={{
        createdProducts,
        updatedProducts,
        deletedIds,
        addLocalProduct,
        updateLocalProduct,
        deleteLocalProduct,
        isDeleted,
        applyLocalMutations,
        applySingleProductMutation,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsMutation() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsMutation must be used within a ProductsProvider');
  }
  return context;
}
