'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Product, ProductFilterParams } from '@/types/product';
import { getProducts, searchProducts, getProductsByCategory } from '@/api/products';
import { useProductsMutation } from '@/context/ProductsContext';
import { filterVegetarianOnly } from '@/utils/productFilters';

interface UseProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  refetch: () => void;
  isCombinedFilterActive: boolean;
}

export function useProducts(filterParams: ProductFilterParams): UseProductsResult {
  const { page, pageSize, search, category, sort, order } = filterParams;
  const { createdProducts, applyLocalMutations } = useProductsMutation();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);

  // Tracks in-flight request identity to prevent race conditions
  const requestIdRef = useRef<number>(0);
  // AbortController reference to cancel superseded requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  const isCombinedFilterActive = Boolean(search && category);

  useEffect(() => {
    // 1. Cancel any active in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 2. Increment request ID for strict order verification
    const currentRequestId = ++requestIdRef.current;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    const fetchData = async () => {
      try {
        const skip = (page - 1) * pageSize;

        let responseProducts: Product[] = [];
        let responseTotal = 0;

        if (search.trim()) {
          // Case A: Search query present (with or without category)
          // Search takes priority on DummyJSON: /products/search?q=...
          const data = await searchProducts({
            q: search.trim(),
            limit: isCombinedFilterActive ? 100 : pageSize, // If combined, fetch larger batch for client-side category filter
            skip: isCombinedFilterActive ? 0 : skip,
            sortBy: sort || undefined,
            order: sort ? order : undefined,
            signal: abortController.signal,
          });

          // Exclude non-vegetarian products
          const vegOnly = filterVegetarianOnly(data.products);

          if (isCombinedFilterActive) {
            // Apply category filtering client-side as per PRD Section 20
            const filtered = vegOnly.filter(
              (p) => p.category.toLowerCase() === category.toLowerCase()
            );
            responseTotal = filtered.length;
            responseProducts = filtered.slice(skip, skip + pageSize);
          } else {
            responseProducts = vegOnly;
            responseTotal = Math.max(0, data.total - (data.products.length - vegOnly.length));
          }
        } else if (category.trim()) {
          // Case B: Category filter without search
          // For groceries, fetch all category items and filter out non-veg items accurately
          const isGroceries = category.trim().toLowerCase() === 'groceries';
          const data = await getProductsByCategory({
            category: category.trim(),
            limit: isGroceries ? 100 : pageSize,
            skip: isGroceries ? 0 : skip,
            sortBy: sort || undefined,
            order: sort ? order : undefined,
            signal: abortController.signal,
          });

          const vegOnly = filterVegetarianOnly(data.products);

          if (isGroceries) {
            responseTotal = vegOnly.length;
            responseProducts = vegOnly.slice(skip, skip + pageSize);
          } else {
            responseProducts = vegOnly;
            responseTotal = Math.max(0, data.total - (data.products.length - vegOnly.length));
          }
        } else {
          // Case C: Standard catalog listing with server-side pagination & sorting
          // Fetch extra buffer to account for the 4 non-vegetarian items in catalog
          const data = await getProducts({
            limit: pageSize + 4,
            skip,
            sortBy: sort || undefined,
            order: sort ? order : undefined,
            signal: abortController.signal,
          });

          const vegOnly = filterVegetarianOnly(data.products);
          responseProducts = vegOnly.slice(0, pageSize);
          // 4 non-veg products in DummyJSON are removed from total catalog
          responseTotal = Math.max(0, data.total - 4);
        }

        // 3. Race condition check: Ensure this is still the latest active request
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        // 4. Integrate local simulated mutations (created, updated, deleted items)
        let mergedList = applyLocalMutations(responseProducts);

        // If on page 1 without filters (or matching filters), prepend relevant locally created products
        if (page === 1) {
          const matchingCreated = createdProducts.filter((cp) => {
            if (category && cp.category.toLowerCase() !== category.toLowerCase()) return false;
            if (search && !cp.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
          });

          // Avoid duplicates if already in list
          const existingIds = new Set(mergedList.map((p) => p.id));
          const uniqueCreated = matchingCreated.filter((cp) => !existingIds.has(cp.id));
          mergedList = [...uniqueCreated, ...mergedList];
          responseTotal += uniqueCreated.length;
        }

        // Client-side sort fallback if combined search+category or custom local edits
        if (sort) {
          mergedList = [...mergedList].sort((a, b) => {
            let valA = a[sort];
            let valB = b[sort];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA === undefined || valA === null) return 1;
            if (valB === undefined || valB === null) return -1;

            if (valA < valB) return order === 'asc' ? -1 : 1;
            if (valA > valB) return order === 'asc' ? 1 : -1;
            return 0;
          });
        }

        setProducts(mergedList);
        setTotal(responseTotal);
        setIsLoading(false);
      } catch (err: unknown) {
        // Discard canceled request errors
        if (axios.isCancel(err) || (err instanceof Error && err.name === 'CanceledError')) {
          return;
        }

        // Only commit error if this request is still active
        if (currentRequestId === requestIdRef.current) {
          const message = err instanceof Error ? err.message : 'Failed to fetch products';
          setError(message);
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [
    page,
    pageSize,
    search,
    category,
    sort,
    order,
    refetchTrigger,
    createdProducts,
    applyLocalMutations,
    isCombinedFilterActive,
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    products,
    total,
    totalPages,
    currentPage: page,
    pageSize,
    isLoading,
    isError,
    error,
    refetch,
    isCombinedFilterActive,
  };
}

export default useProducts;
