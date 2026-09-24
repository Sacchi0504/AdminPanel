'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductFormData, Category } from '@/types/product';
import { validateProductForm, FormErrors } from '@/lib/validation';
import { getCategories } from '@/api/categories';
import { Loader2, Save, X, DollarSign, Box, Tag, Image as ImageIcon, Building2, AlignLeft } from 'lucide-react';

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
  cancelHref?: string;
}

export default function ProductForm({
  initialData,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Save Product',
  cancelHref = '/products',
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price !== undefined ? initialData.price : '',
    category: initialData?.category || '',
    stock: initialData?.stock !== undefined ? initialData.stock : '',
    brand: initialData?.brand || '',
    thumbnail: initialData?.thumbnail || '',
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch categories for dropdown
  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const list = await getCategories();
        if (isMounted) setCategories(list);
      } catch (err) {
        console.error('Failed to load categories for form:', err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? (value === '' ? '' : Number(value)) : value,
    }));

    // Clear error for field as user edits
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submission if already processing
    if (isSubmitting) return;

    // Validate inputs
    const { isValid, errors: validationErrors } = validateProductForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Title */}
        <div id="field-title">
          <label htmlFor="input-title" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Product Title <span className="text-teal-400">*</span>
          </label>
          <input
            id="input-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Wireless Noise-Cancelling Headphones"
            disabled={isSubmitting}
            className={`w-full px-4 py-2.5 bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? 'border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
            } disabled:opacity-50`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Category & Brand Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Category */}
          <div id="field-category">
            <label htmlFor="input-category" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Category <span className="text-teal-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <select
                id="input-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={isSubmitting || loadingCategories}
                className={`w-full pl-10 pr-8 py-2.5 bg-slate-950/70 border rounded-xl text-white text-sm focus:outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${
                  errors.category
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                } disabled:opacity-50`}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
            {errors.category && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.category}</p>
            )}
          </div>

          {/* Brand */}
          <div id="field-brand">
            <label htmlFor="input-brand" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Brand
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                id="input-brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony, Apple, Nike"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Price & Stock Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Price */}
          <div id="field-price">
            <label htmlFor="input-price" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Price (INR ₹) <span className="text-teal-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-sm">
                ₹
              </div>
              <input
                id="input-price"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.price
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                } disabled:opacity-50`}
              />
            </div>
            {errors.price && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.price}</p>
            )}
          </div>

          {/* Stock */}
          <div id="field-stock">
            <label htmlFor="input-stock" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Stock Quantity <span className="text-teal-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Box className="w-4 h-4" />
              </div>
              <input
                id="input-stock"
                name="stock"
                type="number"
                step="1"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                disabled={isSubmitting}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.stock
                    ? 'border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
                } disabled:opacity-50`}
              />
            </div>
            {errors.stock && (
              <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.stock}</p>
            )}
          </div>
        </div>

        {/* Thumbnail URL */}
        <div id="field-thumbnail">
          <label htmlFor="input-thumbnail" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Image URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <input
              id="input-thumbnail"
              name="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
              disabled={isSubmitting}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.thumbnail
                  ? 'border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-700 focus:border-teal-500 focus:ring-teal-500/20'
              } disabled:opacity-50`}
            />
          </div>
          {errors.thumbnail && (
            <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.thumbnail}</p>
          )}
        </div>

        {/* Description */}
        <div id="field-description">
          <label htmlFor="input-description" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Description
          </label>
          <div className="relative">
            <textarea
              id="input-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide key product details, specifications, and highlights..."
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-y disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Form Actions (Duplicate save protection: button disabled while submitting) */}
      <div className="flex items-center justify-end gap-4 pt-2">
        <Link
          href={cancelHref}
          className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          id="product-form-submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-all duration-150 flex items-center gap-2 shadow-lg shadow-teal-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{submitButtonText}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
