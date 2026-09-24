import { ProductFormData } from '@/types/product';

export interface FormErrors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  stock?: string;
  brand?: string;
  thumbnail?: string;
}

/**
 * Validates product form data according to PRD requirements:
 * - Title: Required, min 3 chars
 * - Price: Required, numeric, positive (> 0)
 * - Stock: Required, numeric, non-negative (>= 0)
 * - Category: Required
 */
export function validateProductForm(data: ProductFormData): {
  isValid: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  // Title validation
  if (!data.title.trim()) {
    errors.title = 'Product title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Product title must be at least 3 characters';
  }

  // Category validation
  if (!data.category.trim()) {
    errors.category = 'Please select a category';
  }

  // Price validation
  if (data.price === '' || data.price === undefined || data.price === null) {
    errors.price = 'Price is required';
  } else {
    const numPrice = Number(data.price);
    if (isNaN(numPrice)) {
      errors.price = 'Price must be a valid number';
    } else if (numPrice <= 0) {
      errors.price = 'Price must be greater than zero';
    }
  }

  // Stock validation
  if (data.stock === '' || data.stock === undefined || data.stock === null) {
    errors.stock = 'Stock is required';
  } else {
    const numStock = Number(data.stock);
    if (isNaN(numStock) || !Number.isInteger(numStock)) {
      errors.stock = 'Stock must be a whole integer number';
    } else if (numStock < 0) {
      errors.stock = 'Stock cannot be negative';
    }
  }

  // Thumbnail URL validation (optional, but if provided should be valid format)
  if (data.thumbnail && data.thumbnail.trim()) {
    try {
      new URL(data.thumbnail.trim());
    } catch {
      errors.thumbnail = 'Please enter a valid image URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
