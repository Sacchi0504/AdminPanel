'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';
import { getProduct, deleteProduct as apiDeleteProduct } from '@/api/products';
import { useProductsMutation } from '@/context/ProductsContext';
import { useToast } from '@/context/ToastContext';
import { Product } from '@/types/product';
import DeleteConfirmModal from '@/components/products/DeleteConfirmModal';
import {
  ChevronLeft,
  Edit3,
  Trash2,
  Star,
  ShieldAlert,
  Truck,
  RotateCcw,
  CheckCircle2,
  Box,
  Calendar,
  User,
  Loader2,
  PackageX,
} from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { applySingleProductMutation, createdProducts, deleteLocalProduct } = useProductsMutation();
  const { success: toastSuccess, error: toastError } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  // Deletion modal state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      setIsNotFound(false);

      const numericId = parseInt(productId, 10);
      if (isNaN(numericId)) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      // Check if product was created in the current session
      const locallyCreated = createdProducts.find((p) => p.id === numericId);
      if (locallyCreated) {
        const mutated = applySingleProductMutation(locallyCreated);
        if (mutated && isMounted) {
          setProduct(mutated);
          setSelectedImage(mutated.images?.[0] || mutated.thumbnail || '');
          setIsLoading(false);
          return;
        }
      }

      try {
        const apiData = await getProduct(numericId);
        const finalProduct = applySingleProductMutation(apiData);

        if (!finalProduct) {
          if (isMounted) setIsNotFound(true);
        } else if (isMounted) {
          setProduct(finalProduct);
          setSelectedImage(finalProduct.images?.[0] || finalProduct.thumbnail || '');
        }
      } catch (err) {
        if (isMounted) setIsNotFound(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [productId, createdProducts, applySingleProductMutation]);

  const handleDelete = async () => {
    if (!product || isDeleting) return;

    setIsDeleting(true);
    try {
      await apiDeleteProduct(product.id);
      deleteLocalProduct(product.id);
      toastSuccess(`Product "${product.title}" was deleted.`);
      router.push('/products');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product.';
      toastError(msg);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <ProtectedRoute>
      <AppShell>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Breadcrumb & Action Toolbar */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-teal-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Products</span>
            </Link>

            {product && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>Edit Product</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-teal-500 mb-4" />
              <p className="text-sm font-medium">Loading product details...</p>
            </div>
          ) : isNotFound || !product ? (
            /* Product Not Found View (PRD Section 23) */
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-8">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
                <PackageX className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Product Not Found</h1>
              <p className="text-sm text-slate-400 max-w-md mt-2 mb-6 leading-relaxed">
                The product you&apos;re looking for doesn&apos;t exist or has been removed from the catalog.
              </p>
              <Link
                href="/products"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-teal-600/20"
              >
                Back to Products
              </Link>
            </div>
          ) : (
            /* Product Details Content */
            <div className="space-y-8">
              {/* Main Product Info Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Image Gallery */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Primary Large Image */}
                  <div className="w-full aspect-square bg-slate-950/70 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden p-4 relative">
                    {selectedImage ? (
                      <img
                        src={selectedImage}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-slate-600 text-sm">No image available</span>
                    )}
                    {product.discountPercentage && product.discountPercentage > 0 ? (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold shadow-md">
                        {product.discountPercentage.toFixed(0)}% OFF
                      </div>
                    ) : null}
                  </div>

                  {/* Thumbnail Carousel / List */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {product.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImage(imgUrl)}
                          className={`w-16 h-16 rounded-xl bg-slate-950/70 border overflow-hidden p-1 shrink-0 transition-all ${
                            selectedImage === imgUrl
                              ? 'border-teal-500 ring-2 ring-teal-500/30'
                              : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`${product.title} view ${idx + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Product Details & Specs */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    {/* Category & Brand Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.brand && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {product.brand}
                        </span>
                      )}
                      {product.sku && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800">
                          SKU: {product.sku}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {product.title}
                    </h1>

                    {/* Rating & Reviews Header */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-current'
                                : 'text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-slate-200">
                        {product.rating?.toFixed(1)} / 5.0
                      </span>
                      <span className="text-xs text-slate-500">
                        ({product.reviews?.length || 0} customer reviews)
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="mt-5 flex items-baseline gap-3">
                      <span className="text-3xl font-extrabold text-white">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discountPercentage && product.discountPercentage > 0 ? (
                        <span className="text-base text-slate-400 line-through">
                          $
                          {(
                            product.price /
                            (1 - product.discountPercentage / 100)
                          ).toFixed(2)}
                        </span>
                      ) : null}
                    </div>

                    {/* Description */}
                    <p className="mt-5 text-sm text-slate-300 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Stock Status Bar */}
                    <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Box className="w-5 h-5 text-teal-400" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            Inventory Availability
                          </div>
                          <div className="text-xs text-slate-400">
                            {product.stock > 0
                              ? `${product.stock} units currently in stock`
                              : 'Currently out of stock'}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          product.stock > 10
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : product.stock > 0
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {product.availabilityStatus || (product.stock > 0 ? 'In Stock' : 'Out of Stock')}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
                    {product.shippingInformation && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{product.shippingInformation}</span>
                      </div>
                    )}
                    {product.warrantyInformation && (
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{product.warrantyInformation}</span>
                      </div>
                    )}
                    {product.returnPolicy && (
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-teal-400 shrink-0" />
                        <span>{product.returnPolicy}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer Reviews Section (PRD Section 22) */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white tracking-tight">Customer Reviews</h2>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-semibold">
                      {product.reviews?.length || 0}
                    </span>
                  </div>
                </div>

                {!product.reviews || product.reviews.length === 0 ? (
                  <p className="text-sm text-slate-500 py-6 text-center">
                    No customer reviews available for this product yet.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-800/60 mt-4">
                    {product.reviews.map((review, i) => (
                      <div key={i} className="py-4 first:pt-0 last:pb-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-slate-200">
                              {review.reviewerName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3.5 h-3.5 ${
                                  starIdx < review.rating
                                    ? 'fill-current'
                                    : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                          &ldquo;{review.comment}&rdquo;
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            product={product}
            isOpen={showDeleteModal}
            isDeleting={isDeleting}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
          />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
