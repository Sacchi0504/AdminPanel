'use client';

import React, { useState, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { parseFilterParams, buildFilterQueryString } from '@/utils/urlParams';
import { useProducts } from '@/hooks/useProducts';
import { deleteProduct as apiDeleteProduct } from '@/api/products';
import { useProductsMutation } from '@/context/ProductsContext';
import { useToast } from '@/context/ToastContext';
import { Product, SortField, SortOrder } from '@/types/product';

import SearchBar from '@/components/filters/SearchBar';
import CategoryFilter from '@/components/filters/CategoryFilter';
import SortControl from '@/components/filters/SortControl';
import Pagination from '@/components/pagination/Pagination';
import ProductTable from '@/components/products/ProductTable';
import ProductCardList from '@/components/products/ProductCardList';
import DeleteConfirmModal from '@/components/products/DeleteConfirmModal';
import { TableSkeleton, CardSkeleton } from '@/components/common/LoadingSkeleton';
import EmptyState from '@/components/common/EmptyState';
import ErrorState from '@/components/common/ErrorState';
import { Info, Plus, RotateCcw, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { saveCatalogQuery } from '@/utils/navigation';

function ProductsDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { success: toastSuccess, error: toastError } = useToast();
  const { deleteLocalProduct } = useProductsMutation();

  // Compute catalog query string to preserve pagination & filters across views
  const catalogQueryString = useMemo(() => {
    const str = searchParams?.toString();
    return str ? `?${str}` : '';
  }, [searchParams]);

  // Persist query in sessionStorage
  React.useEffect(() => {
    saveCatalogQuery(catalogQueryString);
  }, [catalogQueryString]);

  // Parse and normalize all URL parameters
  const currentFilters = useMemo(() => {
    return parseFilterParams(searchParams);
  }, [searchParams]);

  // Data fetching hook with race-condition prevention & local mutation merge
  const {
    products,
    total,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    isError,
    error,
    refetch,
    isCombinedFilterActive,
  } = useProducts(currentFilters);

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Helper to push updated query parameters to the URL
  const updateUrlParams = useCallback(
    (updates: Partial<typeof currentFilters>) => {
      const merged = { ...currentFilters, ...updates };
      const queryString = buildFilterQueryString(merged);
      router.push(`${pathname}${queryString}`);
    },
    [currentFilters, pathname, router]
  );

  // Filter change handlers
  const handleSearchChange = useCallback(
    (query: string) => {
      if (query !== currentFilters.search) {
        updateUrlParams({ search: query, page: 1 });
      }
    },
    [currentFilters.search, updateUrlParams]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      if (category !== currentFilters.category) {
        updateUrlParams({ category, page: 1 });
      }
    },
    [currentFilters.category, updateUrlParams]
  );

  const handleSortChange = useCallback(
    (sort: SortField, order: SortOrder) => {
      updateUrlParams({ sort, order });
    },
    [updateUrlParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateUrlParams({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateUrlParams]
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      updateUrlParams({ pageSize: newSize, page: 1 });
    },
    [updateUrlParams]
  );

  const handleResetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  // Delete product action flow
  const handleDeleteConfirm = async () => {
    if (!productToDelete || isDeleting) return;

    setIsDeleting(true);
    try {
      // 1. Call DummyJSON DELETE endpoint
      await apiDeleteProduct(productToDelete.id);

      // 2. Remove from local mutation state
      deleteLocalProduct(productToDelete.id);

      toastSuccess(`Product "${productToDelete.title}" was deleted.`);
      setProductToDelete(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product.';
      toastError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = Boolean(
    currentFilters.search ||
      currentFilters.category ||
      currentFilters.sort ||
      currentFilters.page > 1
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Product Catalog</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              {total} Total
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse, search, sort, and manage all catalog products with live pagination
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span>Reset Filters</span>
            </button>
          )}

          <Link
            href={`/products/new${catalogQueryString}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all duration-150 shadow-md shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <SearchBar
          initialValue={currentFilters.search}
          onSearchChange={handleSearchChange}
          isLoading={isLoading}
        />
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <CategoryFilter
            selectedCategory={currentFilters.category}
            onCategoryChange={handleCategoryChange}
          />
          <SortControl
            currentSort={currentFilters.sort}
            currentOrder={currentFilters.order}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Combined Search + Category Info Notice (PRD Section 20) */}
      {isCombinedFilterActive && (
        <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/50 text-teal-300 text-xs flex items-center gap-2.5 animate-fade-in">
          <Info className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            Showing results for query{' '}
            <strong className="text-white">&ldquo;{currentFilters.search}&rdquo;</strong> filtered
            by category <strong className="text-white capitalize">&ldquo;{currentFilters.category}&rdquo;</strong>.
          </span>
        </div>
      )}

      {/* Content Area: Loading, Error, Empty, or Products */}
      {isError ? (
        <ErrorState message={error || undefined} onRetry={refetch} />
      ) : isLoading ? (
        <>
          <div className="hidden md:block">
            <TableSkeleton rows={Math.min(pageSize, 8)} />
          </div>
          <div className="md:hidden">
            <CardSkeleton count={4} />
          </div>
        </>
      ) : products.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <ProductTable
              products={products}
              currentSort={currentFilters.sort}
              currentOrder={currentFilters.order}
              catalogQueryString={catalogQueryString}
              onSortChange={handleSortChange}
              onDeleteClick={(p) => setProductToDelete(p)}
            />
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <ProductCardList
              products={products}
              catalogQueryString={catalogQueryString}
              onDeleteClick={(p) => setProductToDelete(p)}
            />
          </div>

          {/* Pagination Controls */}
          <div className="pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={total}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        product={productToDelete}
        isOpen={Boolean(productToDelete)}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Suspense
          fallback={
            <div className="py-12 flex justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
              <span>Loading catalog...</span>
            </div>
          }
        >
          <ProductsDashboard />
        </Suspense>
      </AppShell>
    </ProtectedRoute>
  );
}
