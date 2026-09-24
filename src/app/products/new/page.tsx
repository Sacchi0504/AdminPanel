'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import ProductForm from '@/components/products/ProductForm';
import { createProduct as apiCreateProduct } from '@/api/products';
import { useProductsMutation } from '@/context/ProductsContext';
import { useToast } from '@/context/ToastContext';
import { ProductFormData, Product } from '@/types/product';
import { getCatalogReturnUrl } from '@/utils/navigation';
import { ChevronLeft, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function NewProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addLocalProduct } = useProductsMutation();
  const { success: toastSuccess, error: toastError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const returnUrl = useMemo(() => {
    return getCatalogReturnUrl(searchParams);
  }, [searchParams]);

  const handleCreate = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // 1. Send creation request to DummyJSON
      const payload: Partial<Product> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        brand: formData.brand?.trim() || undefined,
        thumbnail: formData.thumbnail?.trim() || 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
      };

      const created = await apiCreateProduct(payload);

      // Construct complete product object for local UI state simulation
      const fullCreatedProduct: Product = {
        id: created.id || Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        brand: formData.brand?.trim() || 'Custom Brand',
        rating: 5.0,
        thumbnail: payload.thumbnail,
        images: [payload.thumbnail || ''],
        reviews: [],
      };

      // 2. Add to local simulated state
      addLocalProduct(fullCreatedProduct);

      toastSuccess(`Product "${formData.title}" was successfully created.`);
      router.push(returnUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create product.';
      toastError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb / Back Link preserving catalog page */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link
          href={returnUrl}
          className="hover:text-teal-400 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Page Title */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create New Product</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Add a new product entry to the catalog with live simulated mutation
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
        submitButtonText="Create Product"
        cancelHref={returnUrl}
      />
    </div>
  );
}

export default function NewProductPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Suspense
          fallback={
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-3" />
              <p className="text-sm font-medium">Loading form...</p>
            </div>
          }
        >
          <NewProductContent />
        </Suspense>
      </AppShell>
    </ProtectedRoute>
  );
}
