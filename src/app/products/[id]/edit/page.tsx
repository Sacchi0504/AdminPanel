'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import ProductForm from '@/components/products/ProductForm';
import { getProduct, updateProduct as apiUpdateProduct } from '@/api/products';
import { useProductsMutation } from '@/context/ProductsContext';
import { useToast } from '@/context/ToastContext';
import { Product, ProductFormData } from '@/types/product';
import { isNonVegetarian } from '@/utils/productFilters';
import { getCatalogReturnUrl } from '@/utils/navigation';
import { ChevronLeft, Edit3, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function EditProductContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = params?.id as string;

  const { updateLocalProduct, applySingleProductMutation, createdProducts } = useProductsMutation();
  const { success: toastSuccess, error: toastError } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const returnUrl = useMemo(() => {
    return getCatalogReturnUrl(searchParams);
  }, [searchParams]);

  const currentQueryString = useMemo(() => {
    const q = searchParams?.toString();
    return q ? `?${q}` : '';
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      setIsLoading(true);
      setIsNotFound(false);

      const numericId = parseInt(productId, 10);
      if (isNaN(numericId)) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      // Check if product was created locally in current session
      const locallyCreated = createdProducts.find((p) => p.id === numericId);
      if (locallyCreated) {
        const mutated = applySingleProductMutation(locallyCreated);
        if (mutated && !isNonVegetarian(mutated) && isMounted) {
          setProduct(mutated);
          setIsLoading(false);
          return;
        }
      }

      try {
        const data = await getProduct(numericId);
        const finalProduct = applySingleProductMutation(data);

        // Exclude non-vegetarian products
        if (!finalProduct || isNonVegetarian(finalProduct)) {
          if (isMounted) setIsNotFound(true);
        } else if (isMounted) {
          setProduct(finalProduct);
        }
      } catch (err) {
        if (isMounted) setIsNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, createdProducts, applySingleProductMutation]);

  const handleUpdate = async (formData: ProductFormData) => {
    if (!product || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const updates: Partial<Product> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        brand: formData.brand?.trim() || undefined,
        thumbnail: formData.thumbnail?.trim() || product.thumbnail,
      };

      // 1. Call API PUT mutation
      await apiUpdateProduct(product.id, updates);

      // 2. Apply to local mutation state
      updateLocalProduct(product.id, updates);

      toastSuccess(`Product "${formData.title}" was successfully updated.`);
      router.push(`/products/${product.id}${currentQueryString}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update product.';
      toastError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link preserving catalog page */}
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Link
          href={product ? `/products/${product.id}${currentQueryString}` : returnUrl}
          className="hover:text-teal-400 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {product ? 'Product Details' : 'Catalog'}</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-3" />
          <p className="text-sm font-medium">Loading product for editing...</p>
        </div>
      ) : isNotFound || !product ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Product Not Found</h2>
          <p className="text-sm text-slate-400 max-w-sm mt-1 mb-6">
            The product you are trying to edit does not exist or has been removed.
          </p>
          <Link
            href={returnUrl}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
          >
            Back to Catalog
          </Link>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Edit &ldquo;{product.title}&rdquo;
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Update product details, pricing (INR), and stock inventory
              </p>
            </div>
          </div>

          {/* Form */}
          <ProductForm
            initialData={{
              title: product.title,
              description: product.description,
              price: product.price,
              category: product.category,
              stock: product.stock,
              brand: product.brand,
              thumbnail: product.thumbnail,
            }}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitButtonText="Save Changes"
            cancelHref={returnUrl}
          />
        </>
      )}
    </div>
  );
}

export default function EditProductPage() {
  return (
    <ProtectedRoute>
      <AppShell>
        <Suspense
          fallback={
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-3" />
              <p className="text-sm font-medium">Loading product for editing...</p>
            </div>
          }
        >
          <EditProductContent />
        </Suspense>
      </AppShell>
    </ProtectedRoute>
  );
}
